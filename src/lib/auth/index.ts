import { betterAuth } from 'better-auth'
import { genericOAuth } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { isNotNil } from 'es-toolkit'

import { serverEnv } from '@/env'

export const auth = betterAuth({
	baseURL: serverEnv.BETTER_AUTH_URL,
	secret: serverEnv.BETTER_AUTH_SECRET,
	plugins: [
		...(isNotNil(serverEnv.OIDC_ISSUER)
			? [
					genericOAuth({
						config: [
							{
								providerId: 'homelab-oidc',
								discoveryUrl: `${serverEnv.OIDC_ISSUER}/.well-known/openid-configuration`,
								clientId: serverEnv.OIDC_CLIENT_ID!,
								clientSecret: serverEnv.OIDC_CLIENT_SECRET!,
								scopes: ['openid', 'email', 'profile'],
								pkce: true,
								accessType: 'offline',
							},
						],
					}),
				]
			: []),
		tanstackStartCookies(), // ⚠️ MUST be last plugin
	],
	trustedOrigins: [serverEnv.BETTER_AUTH_URL, ...(isNotNil(serverEnv.OIDC_ISSUER) ? [serverEnv.OIDC_ISSUER] : [])],
})
