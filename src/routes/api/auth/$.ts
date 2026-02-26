import { createAuth } from '#lib/auth'
import { configMiddleware } from '#lib/config/middleware'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
	server: {
		middleware: [configMiddleware],
		handlers: {
			GET: async ({ request, context: { config } }) => {
				const auth = await createAuth(config)
				return auth.handler(request)
			},
			POST: async ({ request, context: { config } }) => {
				const auth = await createAuth(config)
				return auth.handler(request)
			},
		},
	},
})
