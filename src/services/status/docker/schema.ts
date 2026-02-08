import { z } from 'zod'

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
