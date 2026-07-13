import { createLoggingMiddleware, getLogger } from '#lib/utils/logger'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import ky from 'ky'
import { z } from 'zod'

const logger = getLogger(['widget', 'tailscale'])

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

const tailscaleOAuthTokenSchema = z.object({
	access_token: z.string().min(1),
	token_type: z.string().min(1),
	expires_in: z.number().int().positive(),
})

export type TailscaleDevice = z.infer<typeof tailscaleDeviceSchema>

const TAILSCALE_TOKEN_ENDPOINT = 'https://api.tailscale.com/api/v2/oauth/token'
const TOKEN_EXPIRY_SAFETY_WINDOW = 5_000

const tokenCache = new Map<string, { accessToken: string; expiresAt: number }>()

const getTailscaleBearerToken = async (clientId: string, clientSecret: string): Promise<string> => {
	const cached = tokenCache.get(clientId)
	if (cached && cached.expiresAt > Date.now() + TOKEN_EXPIRY_SAFETY_WINDOW) {
		logger.debug('Reusing cached Tailscale OAuth token for client {clientId}', { clientId })
		return cached.accessToken
	}

	logger.debug('Fetching new Tailscale OAuth token for client {clientId}', { clientId })

	const response = await ky
		.post(TAILSCALE_TOKEN_ENDPOINT, {
			headers: {
				Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
			}),
		})
		.json()
		.then(data => tailscaleOAuthTokenSchema.parse(data))

	if (response.token_type.toLowerCase() !== 'bearer') {
		throw new Error(`Unsupported token type: ${response.token_type}`)
	}

	const tokenData = {
		accessToken: response.access_token,
		expiresAt: Date.now() + response.expires_in * 1000,
	}

	tokenCache.set(clientId, tokenData)

	logger.info('Acquired new Tailscale OAuth token, expires in {expiresIn}s', {
		expiresIn: response.expires_in,
	})

	return tokenData.accessToken
}

const fetchTailscaleData = createServerFn({ method: 'GET' })
	.middleware([createLoggingMiddleware(['widget', 'tailscale'])])
	.inputValidator(
		z.object({
			tailnet: z.string(),
			clientId: z.string(),
			clientSecret: z.string(),
		}),
	)
	.handler(async ({ data: { tailnet, clientId, clientSecret } }) => {
		const { signal } = getRequest()
		const accessToken = await getTailscaleBearerToken(clientId, clientSecret)
		const raw = await ky
			.get(`tailnet/${tailnet}/devices`, {
				prefixUrl: 'https://api.tailscale.com/api/v2/',
				signal,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.json()
			.then(data => tailscaleDevicesResponseSchema.parse(data))

		return raw.devices
	})

export const tailscaleDataQuery = (
	tailnet: string,
	clientId: string,
	clientSecret: string,
	refreshInterval: number,
) =>
	queryOptions({
		queryKey: ['tailscaleData', { tailnet, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchTailscaleData({ data: { tailnet, clientId, clientSecret }, signal }),
		refetchInterval: refreshInterval,
	})
