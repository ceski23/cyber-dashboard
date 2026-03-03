import { PromisePool } from '@supercharge/promise-pool'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import type { ServiceStatus } from '..'
import { pingOptions } from './schema'

type PingParams = {
	timeoutMs?: number
	signal?: AbortSignal
}

type PingResult =
	| {
			alive: true
			time: number
	  }
	| {
			alive: false
			time: null
	  }

const ping = async (host: string, { signal, timeoutMs = 1000 }: PingParams = {}): Promise<PingResult> => {
	const proc = Bun.spawn(['ping', '-n', '-c', '1', '-W', (timeoutMs / 1000).toString(), host], {
		stdout: 'pipe',
		stderr: 'ignore',
		signal,
	})

	try {
		const output = await new Response(proc.stdout).text()
		const match = output.match(/time[=<]([\d.]+)\s*ms/)
		const time = match ? Number(match[1]) : null

		if (time !== null) {
			return {
				alive: true,
				time,
			}
		}

		return {
			alive: false,
			time: null,
		}
	} catch {
		return {
			alive: false,
			time: null,
		}
	}
}

export const streamPingStatus = createServerFn({ method: 'GET' })
	.inputValidator(pingOptions)
	.handler(async function* ({ data: { refreshInterval, services, timeout } }) {
		const { signal } = getRequest()

		while (!signal.aborted) {
			const { results } = await PromisePool.withConcurrency(10)
				.for(Object.entries(services))
				.process(async ([service, host], _, pool) => {
					if (signal.aborted) pool.stop()

					const { alive, time } = await ping(host, {
						timeoutMs: timeout,
						signal,
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
