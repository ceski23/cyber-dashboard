import { defaultServiceApiClient } from '#lib/utils/api'
import { createLoggingMiddleware } from '#lib/utils/logger'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'

const grafanaResponseSchema = z.object({
	status: z.string(),
	data: z.object({
		resultType: z.string(),
		result: z.array(
			z.object({
				metric: z.record(z.string(), z.string()),
				value: z.tuple([z.number(), z.string()]),
			}),
		),
	}),
})

const fetchGrafanaData = createServerFn({ method: 'GET' })
	.middleware([createLoggingMiddleware(['widget', 'grafana'])])
	.inputValidator(
		z.object({
			grafanaUrl: z.string(),
			datasourceUid: z.string(),
			token: z.string().optional(),
			queries: z.array(
				z.object({
					query: z.string(),
					label: z.string(),
					unit: z.string().optional(),
				}),
			),
		}),
	)
	.handler(async ({ data: { grafanaUrl, datasourceUid, token, queries } }) => {
		const { signal } = getRequest()
		const apiClient = defaultServiceApiClient.extend({
			prefixUrl: grafanaUrl,
			signal,
			headers: token !== undefined ? { Authorization: `Bearer ${token}` } : {},
		})

		const results = await Promise.all(
			queries.map(async ({ query, label, unit }) => {
				const response = await apiClient
					.get(`api/datasources/proxy/uid/${datasourceUid}/api/v1/query`, {
						searchParams: { query },
					})
					.json()
					.then(response => grafanaResponseSchema.parse(response))
				const [firstResult] = response.data.result

				if (firstResult === undefined) {
					return {
						query,
						label,
						unit,
						value: null,
					}
				}

				const rawValue = firstResult.value[1]
				const numericValue = Number.parseFloat(rawValue)

				return {
					query,
					label,
					unit,
					value: Number.isNaN(numericValue) ? null : numericValue,
				}
			}),
		)

		return results
	})

export const grafanaDataQuery = (
	grafanaUrl: string,
	datasourceUid: string,
	token: string | undefined,
	queries: Array<{ query: string; label: string; unit?: string }>,
	refreshInterval: number,
) =>
	queryOptions({
		queryKey: ['grafanaData', { grafanaUrl, datasourceUid, queries, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchGrafanaData({ data: { grafanaUrl, datasourceUid, token, queries }, signal }),
		refetchInterval: refreshInterval,
	})
