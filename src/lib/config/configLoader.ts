import { parseJSON, parseYAML, parseJSONC } from 'confbox'
import { defu } from 'defu'
import { type z, type ZodType } from 'zod'

type Dict = Record<string, unknown>

type Provider = {
	provide(): Promise<Dict>
}

type MergeStrategy = 'merge' | 'join'

type QueuedProvider = {
	provider: Provider
	strategy: MergeStrategy
}

/**
 * Deep merge function where later values override earlier ones
 */
const deepMerge = (target: Dict, source: Dict): Dict => {
	const result = { ...target }

	for (const [key, sourceValue] of Object.entries(source)) {
		const targetValue = result[key]

		if (
			sourceValue !== null &&
			typeof sourceValue === 'object' &&
			!Array.isArray(sourceValue) &&
			targetValue !== null &&
			typeof targetValue === 'object' &&
			!Array.isArray(targetValue)
		) {
			result[key] = deepMerge(targetValue as Dict, sourceValue as Dict)
		} else {
			result[key] = sourceValue
		}
	}

	return result
}

/**
 * File-based provider for JSON files
 */
export class JsonProvider implements Provider {
	constructor(private filePath: string) {}

	async provide(): Promise<Dict> {
		try {
			const content = await Bun.file(this.filePath).text()
			return parseJSON(content)
		} catch {
			return {}
		}
	}
}

/**
 * File-based provider for JSONC (JSON with comments)
 */
export class JsoncProvider implements Provider {
	constructor(private filePath: string) {}

	async provide(): Promise<Dict> {
		try {
			const content = await Bun.file(this.filePath).text()
			return parseJSONC(content)
		} catch {
			return {}
		}
	}
}

/**
 * File-based provider for YAML files
 */
export class YamlProvider implements Provider {
	constructor(private filePath: string) {}

	async provide(): Promise<Dict> {
		try {
			const content = await Bun.file(this.filePath).text()
			return parseYAML(content)
		} catch {
			return {}
		}
	}
}

/**
 * Recursively resolves `$file:<path>` references in config values
 */
const resolveFileRefs = async <T>(value: T): Promise<T> => {
	if (typeof value === 'string') {
		const match = value.match(/^\$file:(.+)$/)?.at(1)

		if (match !== undefined) {
			try {
				return (await Bun.file(match).text()).trimEnd() as T
			} catch {
				throw new Error(`Failed to read file referenced in config: ${match}`)
			}
		}

		return value
	}

	if (Array.isArray(value)) {
		return Promise.all(value.map(resolveFileRefs)) as T
	}

	if (value !== null && typeof value === 'object') {
		const entries = Object.entries(value).map(async ([key, val]) => [key, await resolveFileRefs(val)])

		return Object.fromEntries(await Promise.all(entries))
	}

	return value
}

const setNestedValue = (obj: Dict, path: string[], value: unknown): void => {
	let current = obj
	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i]
		if (!(key in current) || typeof current[key] !== 'object' || Array.isArray(current[key])) {
			current[key] = {}
		}
		current = current[key] as Dict
	}
	current[path[path.length - 1]] = value
}

/**
 * Environment variable provider with prefix support
 * Handles nested paths via separator (e.g., CONFIG_DB__HOST -> db.host)
 * To load Docker secrets or file-based values, use `$file:<path>` syntax
 * (e.g., CONFIG_DB__PASSWORD='$file:/run/secrets/db_password')
 */
export class EnvProvider implements Provider {
	constructor(
		private prefix: string = 'CONFIG_',
		private separator: string = '__',
	) {}

	async provide(): Promise<Dict> {
		const result: Dict = {}

		for (const [key, value] of Object.entries(process.env)) {
			if (!key.startsWith(this.prefix) || key.endsWith('_FILE')) {
				continue
			}

			if (value === undefined || value === null || value === '') {
				continue
			}

			// Remove prefix and split by separator
			const configKey = key.slice(this.prefix.length)
			const path = configKey.split(this.separator).map(part =>
				part
					.split('_')
					.map((word, index) => {
						if (index === 0) {
							return word.toLowerCase()
						}
						return word.at(0)?.toUpperCase() + word.slice(1).toLowerCase()
					})
					.join(''),
			)

			setNestedValue(result, path, value)
		}

		return result
	}
}

/**
 * Serialized provider for inline objects (defaults, constants)
 */
export class SerializedProvider implements Provider {
	constructor(private data: Dict) {}

	async provide(): Promise<Dict> {
		return this.data
	}
}

export class ConfigLoader {
	private queue: QueuedProvider[] = []

	/**
	 * Merge a provider, where later values override earlier ones
	 */
	merge(provider: Provider): this {
		this.queue.push({ provider, strategy: 'merge' })
		return this
	}

	/**
	 * Join a provider, where later values only fill holes
	 */
	join(provider: Provider): this {
		this.queue.push({ provider, strategy: 'join' })
		return this
	}

	/**
	 * Load and merge all queued providers
	 * Returns the merged configuration object
	 */
	async load(): Promise<Dict> {
		let config: Dict = {}

		for (const { provider, strategy } of this.queue) {
			const providerConfig = await provider.provide()

			if (strategy === 'merge') {
				config = deepMerge(config, providerConfig)
			} else {
				config = defu(config, providerConfig)
			}
		}

		return resolveFileRefs(config)
	}

	/**
	 * Load and extract configuration with Zod validation
	 */
	async extract<T extends ZodType>(schema: T): Promise<z.infer<T>> {
		const config = await this.load()
		return schema.parse(config)
	}
}
