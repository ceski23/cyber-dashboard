import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { EnvProvider, ConfigLoader, JsoncProvider, JsonProvider, YamlProvider } from './configLoader'
import { configSchema, type DashboardConfig } from './schema'

let config: DashboardConfig | undefined = undefined

const configLoader = new ConfigLoader()
	.merge(new JsonProvider('config.json'))
	.merge(new JsoncProvider('config.jsonc'))
	.merge(new YamlProvider('config.yaml'))
	.merge(new YamlProvider('config.yml'))
	.merge(new EnvProvider('CONFIG_'))

export const getConfig = createServerOnlyFn(async (force: boolean = false) => {
	if (force || !config) {
		config = await configLoader.extract(configSchema)
	}

	return config
})

export const reloadConfigFn = createServerFn({ method: 'POST' }).handler(async () => {
	await getConfig(true)
})

export { type DashboardConfig } from './schema'
