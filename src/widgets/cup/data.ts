import { defaultServiceApiClient } from '#lib/utils/api'
import { createLoggingMiddleware } from '#lib/utils/logger'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'

const cupImageResultSchema = z.object({
	has_update: z.boolean().nullable(),
	info: z
		.object({
			type: z.enum(['digest', 'version']),
			local_digests: z.array(z.string()).optional(),
			remote_digest: z.string().optional(),
			version_update_type: z.enum(['major', 'minor', 'patch']).optional(),
			new_tag: z.string().optional(),
		})
		.nullable(),
	error: z.string().nullable(),
})

const cupImageSchema = z.object({
	reference: z.string(),
	url: z.string().nullable(),
	result: cupImageResultSchema,
})

const cupMetricsSchema = z.object({
	monitored_images: z.number(),
	up_to_date: z.number(),
	updates_available: z.number(),
	major_updates: z.number(),
	minor_updates: z.number(),
	patch_updates: z.number(),
	other_updates: z.number(),
	unknown: z.number(),
})

const cupResponseSchema = z.object({
	metrics: cupMetricsSchema,
	images: z.array(cupImageSchema),
})

export type CupImage = z.infer<typeof cupImageSchema>

export const fetchCupData = createServerFn({ method: 'GET' })
	.middleware([createLoggingMiddleware(['widget', 'cup'])])
	.inputValidator(
		z.object({
			baseUrl: z.string(),
		}),
	)
	.handler(async ({ data: { baseUrl } }) => {
		const { signal } = getRequest()
		const raw = await defaultServiceApiClient.get('api/v3/json', { prefixUrl: baseUrl, signal }).json()
		return cupResponseSchema.parse(raw)
	})

export const refreshCupData = createServerFn({ method: 'GET' })
	.middleware([createLoggingMiddleware(['widget', 'cup', 'refresh'])])
	.inputValidator(
		z.object({
			baseUrl: z.string(),
			auth: z.object({ username: z.string(), password: z.string() }).optional(),
		}),
	)
	.handler(async ({ data: { baseUrl } }) => {
		const { signal } = getRequest()
		await defaultServiceApiClient.get('api/v3/refresh', {
			prefixUrl: baseUrl,
			timeout: false,
			signal,
		})
	})

export const cupDataQuery = (baseUrl: string, refreshInterval: number) =>
	queryOptions({
		queryKey: ['cupData', { baseUrl, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchCupData({ data: { baseUrl }, signal }),
		refetchInterval: refreshInterval,
	})
