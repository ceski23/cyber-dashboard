import { getConfig } from '#lib/config'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { createServerOnlyFn } from '@tanstack/react-start'
import ky from 'ky'
import { z } from 'zod'

const oidcDiscoverySchema = z.object({
	token_endpoint: z.url(),
})

const tokenResponseSchema = z.object({
	access_token: z.string().min(1),
	token_type: z.string().min(1),
	expires_in: z.number().int().positive(),
})

const TOKEN_EXPIRY_SAFETY_WINDOW_MS = 1_000

const serviceAuthQueryClient = new QueryClient()

type OAuth2AuthConfig = Omit<
	Extract<Awaited<ReturnType<typeof getConfig>>['authentication'], { type: 'oauth2' }>,
	'type'
>

const bearerTokenQueryOptions = ({ clientId, clientSecret, issuer, scope }: OAuth2AuthConfig) =>
	queryOptions({
		queryKey: ['oidc-service-token', issuer, clientId, clientSecret, scope] as const,
		queryFn: async () => {
			const discoveryUrl = new URL('.well-known/openid-configuration', issuer).toString()
			const { token_endpoint } = await ky
				.get(discoveryUrl)
				.json()
				.then(data => oidcDiscoverySchema.parse(data))

			const tokenResponse = await ky
				.post(token_endpoint, {
					headers: {
						Accept: 'application/json',
						Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
					},
					body: new URLSearchParams({
						grant_type: 'client_credentials',
						response_mode: 'form_post',
						scope,
					}),
				})
				.json()
				.then(data => tokenResponseSchema.parse(data))

			if (tokenResponse.token_type.toLowerCase() !== 'bearer') {
				throw new Error(`Unsupported token type: ${tokenResponse.token_type}`)
			}

			return {
				accessToken: tokenResponse.access_token,
				expiresAt: Date.now() + tokenResponse.expires_in * 1000,
			}
		},
	})

export const getServiceBearerToken = createServerOnlyFn(async () => {
	const { authentication } = await getConfig()

	if (authentication?.type !== 'oauth2') {
		return undefined
	}

	const existingToken = serviceAuthQueryClient.getQueryData(bearerTokenQueryOptions(authentication).queryKey)
	const staleTime = existingToken
		? Math.max(existingToken.expiresAt - Date.now() - TOKEN_EXPIRY_SAFETY_WINDOW_MS, 0)
		: 0

	return serviceAuthQueryClient.fetchQuery({
		...bearerTokenQueryOptions(authentication),
		staleTime,
	})
})
