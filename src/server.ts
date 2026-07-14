import { getConfig } from '#lib/config'
import { ConfigError } from '#lib/config/configError'
import { configureLogtape, getLogger } from '#lib/utils/logger'
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

configureLogtape()

const logger = getLogger(['server'])

export default createServerEntry({
	fetch: request => handler.fetch(request),
})

try {
	await getConfig()
	logger.info('Config loaded successfully')
} catch (error) {
	if (error instanceof ConfigError) {
		logger.fatal(`Config validation error:\n{error}`, { error })
	} else {
		logger.fatal('Error loading config: {error}', { error })
	}
}
