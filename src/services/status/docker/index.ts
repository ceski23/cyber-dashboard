import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import Docker from 'dockerode'

import type { ServiceStatus } from '..'

import { dockerOptions } from './schema'

const mapDockerStateToStatus = (state: string): ServiceStatus['status'] => {
	switch (state) {
		case 'running':
			return 'available'
		case 'created':
		case 'restarting':
		case 'removing':
		case 'paused':
			return 'pending'
		case 'exited':
		case 'dead':
			return 'unavailable'
		default:
			return 'unknown'
	}
}

export const streamDockerStatus = createServerFn({ method: 'GET' })
	.inputValidator(dockerOptions)
	.handler(async function* ({ data: { connection, refreshInterval } }) {
		const { signal } = getRequest()
		const docker = new Docker(connection)

		while (!signal.aborted) {
			const containers = await docker.listContainers({
				all: true,
				abortSignal: signal,
			})

			yield containers.map<ServiceStatus>(container => ({
				service: container.Names.join(', ').slice(1),
				status: mapDockerStateToStatus(container.State),
				label: container.Status,
			}))

			await Bun.sleep(refreshInterval)
		}
	})
