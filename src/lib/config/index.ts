import { getLogger } from '#lib/utils/logger'
import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { EnvProvider, ConfigLoader, JsoncProvider, JsonProvider, YamlProvider } from './configLoader'
import { configSchema, type DashboardConfig } from './schema'

const logger = getLogger(['config'])

const configKey = Symbol.for('dashboardConfig')

// oxlint-disable-next-line no-shadow-restricted-names
declare const globalThis: {
	[configKey]?: DashboardConfig
}

const configLoader = new ConfigLoader()
	.merge(new JsonProvider('config.json'))
	.merge(new JsoncProvider('config.jsonc'))
	.merge(new YamlProvider('config.yaml'))
	.merge(new YamlProvider('config.yml'))
	.merge(new EnvProvider('CONFIG_'))

export const getConfig = createServerOnlyFn(async (force: boolean = false) => {
	if (force || !globalThis[configKey]) {
		globalThis[configKey] = await configLoader.extract(configSchema)
		logger.info('Config loaded')
	}

	return globalThis[configKey]
})

export const reloadConfigFn = createServerFn({ method: 'POST' }).handler(async () => {
	logger.info('Reloading config')
	await getConfig(true)
})

export { type DashboardConfig } from './schema'
