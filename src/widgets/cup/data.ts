import { withBasicAuth } from '#lib/utils/auth'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import ky from 'ky'
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
	.inputValidator(
		z.object({
			baseUrl: z.string(),
			auth: z.object({ username: z.string(), password: z.string() }).optional(),
		}),
	)
	.handler(async ({ data: { baseUrl, auth } }) => {
		const raw = await ky
			.get('api/v3/json', {
				prefixUrl: baseUrl,
				hooks: {
					beforeRequest: auth ? [withBasicAuth(auth)] : [],
				},
			})
			.json()
		return cupResponseSchema.parse(raw)
	})

export const refreshCupData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			baseUrl: z.string(),
			auth: z.object({ username: z.string(), password: z.string() }).optional(),
		}),
	)
	.handler(async ({ data: { baseUrl, auth } }) => {
		await ky.get('api/v3/refresh', {
			prefixUrl: baseUrl,
			hooks: {
				beforeRequest: auth ? [withBasicAuth(auth)] : [],
			},
			timeout: false,
		})
	})

export const cupDataQuery = (
	baseUrl: string,
	auth: { username: string; password: string } | undefined,
	refreshInterval: number,
) =>
	queryOptions({
		queryKey: ['cupData', { baseUrl, auth, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchCupData({ data: { baseUrl, auth }, signal }),
		refetchInterval: refreshInterval,
	})
