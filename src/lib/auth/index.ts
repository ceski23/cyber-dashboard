import { createServerOnlyFn } from '@tanstack/react-start'
import { betterAuth } from 'better-auth'
import { genericOAuth } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { type DashboardConfig } from '../config'

export const createAuth = createServerOnlyFn(async ({ auth, baseUrl }: DashboardConfig) => {
	const oauthPlugin =
		auth?.type !== 'oidc'
			? undefined
			: genericOAuth({
					config: [
						{
							providerId: 'homelab-oidc',
							discoveryUrl: new URL('.well-known/openid-configuration', auth.issuer).toString(),
							clientId: auth.clientId,
							clientSecret: auth.clientSecret,
							scopes: ['openid', 'email', 'profile'],
							pkce: true,
							accessType: 'offline',
						},
					],
				})

	return betterAuth({
		baseURL: baseUrl,
		plugins: [
			...(oauthPlugin ? [oauthPlugin] : []),
			tanstackStartCookies(), // ⚠️ MUST be last plugin
		],
		trustedOrigins: [baseUrl, ...(auth?.type === 'oidc' ? [auth.issuer] : [])],
	})
})
