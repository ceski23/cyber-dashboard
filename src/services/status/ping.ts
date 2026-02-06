import { PromisePool } from '@supercharge/promise-pool'
import { createServerFn } from '@tanstack/react-start'
import ping from 'ping'
import z from 'zod'

import type { ServiceStatus } from './index'

export const pingOptions = z.strictObject({
	type: z.literal('ping'),
	refreshInterval: z.number().default(5000).describe('The interval in milliseconds to refresh the ping status.'),
	timeout: z.number().default(5000).describe('The timeout in milliseconds for each ping request.'),
	version: z.enum(['ipv4', 'ipv6']).default('ipv4').describe('Whether to use IPv4 or IPv6 for pinging.'),
	services: z.record(
		z.string().describe('Service identifier'),
		z.string().describe('The host to ping (IP address or domain name)'),
	),
})

export const streamPingStatus = createServerFn({ method: 'GET' })
	.inputValidator(pingOptions)
	.handler(async function* ({ data: { refreshInterval, services, version, timeout }, signal }) {
		while (!signal.aborted) {
			const { results } = await PromisePool.withConcurrency(10)
				.for(Object.entries(services))
				.process(async ([service, host], _, pool) => {
					if (signal.aborted) pool.stop()

					const { alive, time } = await ping.promise.probe(host, {
						timeout: timeout / 1000,
						v6: version === 'ipv6',
					})

					return {
						service,
						status: alive ? 'available' : 'unavailable',
						label: alive
							? `${time.toLocaleString(undefined, { maximumFractionDigits: 0 })} ms`
							: 'Unreachable',
					} satisfies ServiceStatus
				})

			yield results

			await Bun.sleep(refreshInterval)
		}
	})
