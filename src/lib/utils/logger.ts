import {
	configureSync,
	getAnsiColorFormatter,
	getConsoleSink,
	getLogfmtFormatter,
	getLogger as logtapeGetLogger,
} from '@logtape/logtape'
import { type Logger } from '@logtape/logtape'
import { createMiddleware } from '@tanstack/react-start'
import { z } from 'zod'

export const configureLogtape = () => {
	const logLevel = z
		.enum(['trace', 'debug', 'info', 'warning', 'error', 'fatal'])
		.optional()
		.default('info')
		.parse(process.env.LOG_LEVEL)

	configureSync({
		sinks: {
			console: getConsoleSink({
				formatter: import.meta.env.DEV ? getAnsiColorFormatter() : getLogfmtFormatter(),
			}),
		},
		loggers: [
			{
				category: ['cyber-dashboard'],
				lowestLevel: logLevel,
				sinks: ['console'],
			},
			{
				category: ['logtape', 'meta'],
				lowestLevel: 'warning',
				sinks: ['console'],
			},
		],
		reset: import.meta.env.DEV,
	})
}

export const getLogger = (category: string[]): Logger => logtapeGetLogger(['cyber-dashboard', ...category])

export const createLoggingMiddleware = (category: string[]) => {
	const logger = getLogger(category)

	return createMiddleware().server(async ({ next }) => {
		try {
			return await next()
		} catch (error) {
			logger.error('Handler failed: {error}', { error })
			throw error
		}
	})
}
