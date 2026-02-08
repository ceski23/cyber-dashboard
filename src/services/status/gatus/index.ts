import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import ky from 'ky'
import { z } from 'zod'

import type { ServiceStatus } from '..'

import { gatusOptions } from './schema'

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
	.handler(async function* ({ data: { connection, refreshInterval } }) {
		const { signal } = getRequest()
		const apiClient = ky.create({ prefixUrl: connection.baseUrl })

		while (!signal.aborted) {
			const endpoints = await apiClient
				.get('api/v1/endpoints/statuses', { signal })
				.json()
				.then(data => gatusResponseSchema.parse(data))

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
