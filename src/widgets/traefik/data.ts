import { withBasicAuth } from '#lib/utils/auth'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import ky from 'ky'
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
			auth: z.object({ username: z.string(), password: z.string() }).optional(),
		}),
	)
	.handler(async ({ data: { baseUrl, auth } }) => {
		const { signal } = getRequest()
		const overview = await ky
			.get('api/overview', {
				prefixUrl: baseUrl,
				signal,
				hooks: {
					beforeRequest: auth ? [withBasicAuth(auth)] : [],
				},
			})
			.json()
			.then(raw => traefikOverviewSchema.parse(raw))

		return {
			routers: overview.http.routers,
			services: overview.http.services,
			middlewares: overview.http.middlewares,
		}
	})

export const traefikDataQuery = (
	baseUrl: string,
	auth: { username: string; password: string } | undefined,
	refreshInterval: number,
) =>
	queryOptions({
		queryKey: ['traefikData', { baseUrl, auth, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchTraefikData({ data: { baseUrl, auth }, signal }),
		refetchInterval: refreshInterval,
	})
