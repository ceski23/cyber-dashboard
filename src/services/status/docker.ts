import { createServerFn } from '@tanstack/react-start'
import Docker from 'dockerode'
import { z } from 'zod'

import type { ServiceStatus } from './index'

export const dockerOptions = z.strictObject({
	type: z.literal('docker'),
	refreshInterval: z.number().default(5000).describe('The interval in milliseconds to refresh the Docker status.'),
	connection: z.union([
		z.strictObject({
			socketPath: z.string().default('/var/run/docker.sock').describe('The path to the Docker socket.'),
		}),
		z.strictObject({
			host: z.string().describe('The Docker host URL.'),
			port: z.number().default(2375).describe('The Docker host port.'),
			protocol: z
				.enum(['http', 'https'])
				.default('http')
				.describe('The protocol to use when connecting to the Docker host.'),
			headers: z
				.record(z.string(), z.string())
				.optional()
				.describe('Optional headers for the Docker connection.'),
		}),
	]),
})

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
	.handler(async function* ({ data: { connection, refreshInterval }, signal }) {
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
