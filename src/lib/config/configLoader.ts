import { defu } from 'defu'
import { merge } from 'es-toolkit'
import { set } from 'es-toolkit/compat'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { ConfigError } from './configError'
import { parseJsoncDocument } from './jsonParser'
import type { ParsedDocument } from './parsedDocument'
import { parseYamlDocument } from './yamlParser'

type Dict = Record<string, unknown>

type ProviderResult = {
	data: Dict
	parsedDocument?: ParsedDocument
}

type Provider = {
	provide(): Promise<ProviderResult>
}

type MergeStrategy = 'merge' | 'join'

type QueuedProvider = {
	provider: Provider
	strategy: MergeStrategy
}

/**
 * File-based provider for JSON files
 */
export class JsonProvider implements Provider {
	constructor(private filePath: string) {}

	async provide(): Promise<ProviderResult> {
		try {
			const content = await Bun.file(this.filePath).text()
			const parsed = parseJsoncDocument(content)
			return { data: parsed.data, parsedDocument: parsed }
		} catch {
			return { data: {} }
		}
	}
}

/**
 * File-based provider for JSONC (JSON with comments)
 */
export class JsoncProvider implements Provider {
	constructor(private filePath: string) {}

	async provide(): Promise<ProviderResult> {
		try {
			const content = await Bun.file(this.filePath).text()
			const parsed = parseJsoncDocument(content)
			return { data: parsed.data, parsedDocument: parsed }
		} catch {
			return { data: {} }
		}
	}
}

/**
 * File-based provider for YAML files
 */
export class YamlProvider implements Provider {
	constructor(private filePath: string) {}

	async provide(): Promise<ProviderResult> {
		try {
			const content = await Bun.file(this.filePath).text()
			const parsed = parseYamlDocument(content)
			return { data: parsed.data, parsedDocument: parsed }
		} catch {
			return { data: {} }
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

	async provide(): Promise<ProviderResult> {
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

			set(result, path, value)
		}

		return { data: result }
	}
}

/**
 * Serialized provider for inline objects (defaults, constants)
 */
export class SerializedProvider implements Provider {
	constructor(private data: Dict) {}

	async provide(): Promise<ProviderResult> {
		return { data: this.data }
	}
}

type LoadResult = {
	data: Dict
	parsedDocuments: ParsedDocument[]
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
	 * Returns the merged configuration object and any parsed documents
	 */
	async load(): Promise<LoadResult> {
		let config: Dict = {}
		const parsedDocuments: ParsedDocument[] = []

		for (const { provider, strategy } of this.queue) {
			const { data, parsedDocument } = await provider.provide()

			if (parsedDocument) {
				parsedDocuments.push(parsedDocument)
			}

			if (strategy === 'merge') {
				config = merge(config, data)
			} else {
				config = defu(config, data)
			}
		}

		config = await resolveFileRefs(config)

		return { data: config, parsedDocuments }
	}

	/**
	 * Load and extract configuration with Zod validation
	 */
	async extract<T extends ZodType>(schema: T): Promise<z.infer<T>> {
		const { data, parsedDocuments } = await this.load()

		try {
			return schema.parse(data)
		} catch (error) {
			if (error instanceof z.ZodError) {
				throw new ConfigError(error, parsedDocuments)
			}

			throw error
		}
	}
}
