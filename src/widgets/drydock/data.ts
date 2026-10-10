import { defaultServiceApiClient } from '#lib/utils/api'
import { createLoggingMiddleware } from '#lib/utils/logger'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { drydockResponseSchema, getMetrics, sortBySeverity } from './utils'

export type DrydockApiError = { error: string }
export type DrydockQueryError = DrydockApiError | Error

const requestSchema = z.object({
	baseUrl: z.url(),
	auth: z
		.object({
			username: z.string(),
			password: z.string(),
		})
		.optional(),
})
type DrydockRequest = z.infer<typeof requestSchema>

const getHeaders = (auth: DrydockRequest['auth']) =>
	auth ? { Authorization: `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString('base64')}` } : undefined

const fetchDrydockData = createServerFn({ method: 'GET' })
	.middleware([createLoggingMiddleware(['widget', 'drydock'])])
	.inputValidator(requestSchema)
	.handler(async ({ data: { baseUrl, auth } }) => {
		const { signal } = getRequest()
		const response = await defaultServiceApiClient.get('api/v1/containers', {
			prefixUrl: baseUrl,
			headers: getHeaders(auth),
			searchParams: { limit: 0 },
			signal,
			throwHttpErrors: false,
		})
		if (!response.ok) throw await response.json<DrydockApiError>()
		const containers = sortBySeverity(drydockResponseSchema.parse(await response.json()))

		return {
			containers,
			metrics: getMetrics(containers),
		}
	})

export const refreshDrydockData = createServerFn({ method: 'POST' })
	.middleware([createLoggingMiddleware(['widget', 'drydock', 'refresh'])])
	.inputValidator(requestSchema)
	.handler(async ({ data: { baseUrl, auth } }) => {
		const { signal } = getRequest()
		const response = await defaultServiceApiClient.post('api/v1/containers/watch', {
			prefixUrl: baseUrl,
			headers: getHeaders(auth),
			timeout: false,
			signal,
			throwHttpErrors: false,
		})
		if (!response.ok) throw await response.json<DrydockApiError>()
	})

export const drydockDataQuery = (baseUrl: string, refreshInterval: number, auth?: DrydockRequest['auth']) =>
	queryOptions<Awaited<ReturnType<typeof fetchDrydockData>>, DrydockQueryError>({
		queryKey: ['drydockData', { baseUrl, refreshInterval, username: auth?.username }] as const,
		queryFn: ({ signal }) => fetchDrydockData({ data: { baseUrl, auth }, signal }),
		refetchInterval: refreshInterval,
	})
