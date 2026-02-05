import { createServerFn } from '@tanstack/react-start'
import ky from 'ky'
import { z } from 'zod'

import type { ServiceStatus } from '.'

export const gatusOptions = z.strictObject({
	type: z.literal('gatus'),
	refreshInterval: z.number().default(5000).describe('The interval in milliseconds to refresh the Gatus status.'),
	connection: z.strictObject({
		baseUrl: z.string().describe('The base URL of the Gatus instance.'),
	}),
})

const gatusResponseSchema = z.array(
	z.object({
		name: z.string(),
		key: z.string(),
		group: z.string().optional(),
		results: z
			.array(
				z.object({
					status: z.number().optional(),
					hostname: z.string(),
					duration: z.number(),
					conditionResults: z.array(
						z.object({
							condition: z.string(),
							success: z.boolean(),
						}),
					),
					success: z.boolean(),
					timestamp: z.string(),
					errors: z.array(z.string()).optional(),
				}),
			)
			.optional(),
	}),
)

export const streamGatusStatus = createServerFn({ method: 'GET' })
	.inputValidator(gatusOptions)
	.handler(async function* ({ data: { connection, refreshInterval }, signal }) {
		const apiClient = ky.create({ prefixUrl: connection.baseUrl })

		while (!signal.aborted) {
			const endpoints = await apiClient
				.get('api/v1/endpoints/statuses', { signal })
				.json()
				.then(gatusResponseSchema.parse)

			yield endpoints.map<ServiceStatus>(endpoint => {
				const isSuccess = endpoint.results?.at(-1)?.success

				return {
					service: endpoint.name,
					status: isSuccess === undefined ? 'unknown' : isSuccess ? 'available' : 'unavailable',
					label: isSuccess === undefined ? 'No Data' : isSuccess ? 'Up' : 'Down',
				}
			})

			await Bun.sleep(refreshInterval)
		}
	})
