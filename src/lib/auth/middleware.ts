import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { isNil } from 'es-toolkit'

import { configMiddleware } from '../config/middleware'

import { createAuth } from './index'

export const authMiddleware = createMiddleware()
	.middleware([configMiddleware])
	.server(async ({ next, context: { config }, pathname }) => {
		const headers = getRequestHeaders()

		if (!config.auth) {
			return await next()
		}

		switch (config.auth.type) {
			case 'basic': {
				const authHeader = headers.get('Authorization')

				if (isNil(authHeader)) {
					return new Response('Unauthorized', {
						status: 401,
						headers: { 'WWW-Authenticate': 'Basic' },
					})
				}

				const credentials = authHeader.split(' ').at(1)
				const decoded = Buffer.from(credentials, 'base64').toString()
				const [user, pass] = decoded.split(':')

				if (user !== config.auth.username || pass !== config.auth.password) {
					return new Response('Unauthorized', {
						status: 401,
						headers: { 'WWW-Authenticate': 'Basic' },
					})
				}

				break
			}

			case 'oidc': {
				const auth = await createAuth(config)
				const session = await auth.api.getSession({ headers })

				if (!session) {
					throw redirect({ to: '/login', search: { redirect: pathname } })
				}

				break
			}
			default:
				config.auth satisfies never
				throw new Error(`Unsupported auth type`)
		}

		return await next()
	})
