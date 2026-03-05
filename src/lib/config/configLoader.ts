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
 * Supports Docker secrets pattern with _FILE suffix (e.g., CONFIG_PASSWORD_FILE=/run/secrets/password)
 */
export class EnvProvider implements Provider {
	constructor(
		private prefix: string = 'CONFIG_',
		private separator: string = '__',
	) {}

	async provide(): Promise<Dict> {
		const result: Dict = {}
		const processedKeys = new Set<string>()

		// First pass: collect all _FILE suffixes and load them
		const fileContents: Record<string, string> = {}
		for (const [key, value] of Object.entries(process.env)) {
			if (!key.startsWith(this.prefix) || !key.endsWith('_FILE')) {
				continue
			}
			if (value === undefined || value === null || value === '') {
				continue
			}
			const baseKey = key.slice(0, -5) // Remove '_FILE' suffix
			processedKeys.add(key)
			processedKeys.add(baseKey) // Mark base key as processed too
			fileContents[baseKey] = await Bun.file(value).text()
		}

		// Second pass: process all env vars (excluding _FILE variants)
		for (const [key, value] of Object.entries(process.env)) {
			if (!key.startsWith(this.prefix) || processedKeys.has(key)) {
				continue
			}

			if (value === undefined || value === null || value === '') {
				continue
			}

			const finalValue = fileContents[key] ?? value

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

			setNestedValue(result, path, finalValue)
		}

		// Add _FILE loaded values
		for (const [key, content] of Object.entries(fileContents)) {
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
			setNestedValue(result, path, content)
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

		return config
	}

	/**
	 * Load and extract configuration with Zod validation
	 */
	async extract<T extends ZodType>(schema: T): Promise<z.infer<T>> {
		const config = await this.load()
		return schema.parse(config)
	}
}
