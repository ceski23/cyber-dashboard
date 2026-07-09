import { getConfig } from '#lib/config'
import { configureLogtape, getLogger } from '#lib/utils/logger'
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import z, { prettifyError } from 'zod'

configureLogtape()

const logger = getLogger(['server'])

export default createServerEntry({
	fetch: request => handler.fetch(request),
})

try {
	await getConfig()
	logger.info('Config loaded successfully')
} catch (error) {
	if (error instanceof z.ZodError) {
		logger.fatal('Config validation error: {details}', { details: prettifyError(error) })
	} else {
		logger.fatal('Error loading config: {error}', { error })
	}

	process.exit(1)
}
