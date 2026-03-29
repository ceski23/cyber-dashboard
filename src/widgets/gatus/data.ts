import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import ky from 'ky'
import { z } from 'zod'

const gatusEndpointSchema = z.object({
	name: z.string(),
	key: z.string(),
	group: z.string().optional(),
	results: z
		.array(
			z.object({
				duration: z.number(),
				success: z.boolean(),
			}),
		)
		.optional(),
})

const gatusResponseSchema = z.array(gatusEndpointSchema)

export type GatusEndpoint = {
	key: string
	name: string
	group?: string
	status: 'available' | 'unavailable' | 'unknown'
	durationMs: number
	history: Array<{
		success: boolean
		durationMs: number
	}>
}

const fetchGatusWidgetData = createServerFn({ method: 'GET' })
	.inputValidator(z.object({ baseUrl: z.string() }))
	.handler(async ({ data: { baseUrl } }) => {
		const { signal } = getRequest()
		const raw = await ky
			.get('api/v1/endpoints/statuses', { prefixUrl: baseUrl, signal })
			.json()
			.then(data => gatusResponseSchema.parse(data))

		return raw.map<GatusEndpoint>(endpoint => {
			const results = endpoint.results ?? []
			const lastResult = results.at(-1)
			const isSuccess = lastResult?.success

			return {
				key: endpoint.key,
				name: endpoint.name,
				group: endpoint.group,
				status: isSuccess === undefined ? 'unknown' : isSuccess ? 'available' : 'unavailable',
				durationMs: lastResult ? Math.round(lastResult.duration / 1_000_000) : 0,
				history: results.map(result => ({
					success: result.success,
					durationMs: Math.round(result.duration / 1_000_000),
				})),
			}
		})
	})

export const gatusWidgetQuery = (baseUrl: string, refreshInterval: number) =>
	queryOptions({
		queryKey: ['gatusWidgetData', { baseUrl }] as const,
		queryFn: ({ signal }) => fetchGatusWidgetData({ data: { baseUrl }, signal }),
		refetchInterval: refreshInterval,
	})
