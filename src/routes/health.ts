import { getConfig } from '#lib/config'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/health')({
	server: {
		handlers: {
			GET: async () =>
				getConfig()
					.then(() => Response.json({ status: 'ok' }))
					.catch(error => Response.json(error, { status: 503 })),
		},
	},
})
