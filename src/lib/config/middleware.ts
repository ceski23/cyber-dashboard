import { createMiddleware } from '@tanstack/react-start'
import { getConfig } from './index'

export const configMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		const config = await getConfig()

		return next({
			context: {
				config,
			},
		})
	} catch (error) {
		return new Response(error instanceof Error ? error.message : 'Could not load config', {
			status: 500,
		})
	}
})
