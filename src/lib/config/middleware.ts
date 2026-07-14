import { createMiddleware } from '@tanstack/react-start'
import { getConfig } from './index'

export const configMiddleware = createMiddleware().server(async ({ next }) => {
	const config = await getConfig()

	return next({
		context: {
			config,
		},
	})
})
