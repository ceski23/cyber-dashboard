import { createLoggingMiddleware } from '#lib/utils/logger'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import ky from 'ky'
import { z } from 'zod'

const tailscaleDeviceSchema = z.object({
	id: z.string(),
	nodeId: z.string().optional(),
	name: z.string(),
	hostname: z.string(),
	os: z.string(),
	connectedToControl: z.boolean(),
	lastSeen: z.string().optional(),
	clientVersion: z.string().optional(),
	user: z.string().optional(),
	tags: z.array(z.string()).optional(),
	addresses: z.array(z.string()).optional(),
	authorized: z.boolean().optional(),
	updateAvailable: z.boolean().optional(),
})

const tailscaleDevicesResponseSchema = z.object({
	devices: z.array(tailscaleDeviceSchema),
})

export type TailscaleDevice = z.infer<typeof tailscaleDeviceSchema>

const fetchTailscaleData = createServerFn({ method: 'GET' })
	.middleware([createLoggingMiddleware(['widget', 'tailscale'])])
	.inputValidator(
		z.object({
			tailnet: z.string(),
			apiKey: z.string(),
		}),
	)
	.handler(async ({ data: { tailnet, apiKey } }) => {
		const { signal } = getRequest()
		const raw = await ky
			.get(`tailnet/${tailnet}/devices`, {
				prefixUrl: 'https://api.tailscale.com/api/v2/',
				signal,
				headers: {
					Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
				},
			})
			.json()
			.then(data => tailscaleDevicesResponseSchema.parse(data))

		return raw.devices
	})

export const tailscaleDataQuery = (tailnet: string, apiKey: string, refreshInterval: number) =>
	queryOptions({
		queryKey: ['tailscaleData', { tailnet, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchTailscaleData({ data: { tailnet, apiKey }, signal }),
		refetchInterval: refreshInterval,
	})
