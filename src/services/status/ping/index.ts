import { PromisePool } from '@supercharge/promise-pool'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import ping from 'ping'

import type { ServiceStatus } from '..'

import { pingOptions } from './schema'

export const streamPingStatus = createServerFn({ method: 'GET' })
	.inputValidator(pingOptions)
	.handler(async function* ({ data: { refreshInterval, services, version, timeout } }) {
		const { signal } = getRequest()

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
