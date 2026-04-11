import { defaultServiceApiClient } from '#lib/utils/api'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'

const traefikStatSchema = z.object({
	total: z.number(),
	warnings: z.number(),
	errors: z.number(),
})

const traefikOverviewSchema = z.object({
	http: z.object({
		routers: traefikStatSchema,
		services: traefikStatSchema,
		middlewares: traefikStatSchema,
	}),
})

export type TraefikStat = z.infer<typeof traefikStatSchema>

const fetchTraefikData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			baseUrl: z.string(),
		}),
	)
	.handler(async ({ data: { baseUrl } }) => {
		const { signal } = getRequest()
		const overview = await defaultServiceApiClient
			.get('api/overview', {
				prefixUrl: baseUrl,
				signal,
			})
			.json()
			.then(raw => traefikOverviewSchema.parse(raw))

		return {
			routers: overview.http.routers,
			services: overview.http.services,
			middlewares: overview.http.middlewares,
		}
	})

export const traefikDataQuery = (baseUrl: string, refreshInterval: number) =>
	queryOptions({
		queryKey: ['traefikData', { baseUrl, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchTraefikData({ data: { baseUrl }, signal }),
		refetchInterval: refreshInterval,
	})
