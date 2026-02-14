import { z } from 'zod'

export const pingOptions = z.strictObject({
	type: z.literal('ping'),
	refreshInterval: z.number().default(5000).describe('The interval in milliseconds to refresh the ping status.'),
	timeout: z.number().default(5000).describe('The timeout in milliseconds for each ping request.'),
	services: z.record(
		z.string().describe('Service identifier'),
		z.string().describe('The host to ping (IP address or domain name)'),
	),
})
