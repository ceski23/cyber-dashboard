import { z } from 'zod'

export const gatusOptions = z.strictObject({
	type: z.literal('gatus'),
	refreshInterval: z.number().default(5000).describe('The interval in milliseconds to refresh the Gatus status.'),
	connection: z.strictObject({
		baseUrl: z.string().describe('The base URL of the Gatus instance.'),
	}),
})
