import { ConfigError } from '#lib/config/configError'
import { createSerializationAdapter } from '@tanstack/react-router'

export const configErrorAdapter = createSerializationAdapter({
	key: 'ConfigError',
	test: (value): value is ConfigError => value instanceof ConfigError,
	toSerializable: ({ message, formatted }: ConfigError) => ({
		message,
		formatted,
	}),
	fromSerializable: ({ message, formatted }) => {
		const error = Object.create(ConfigError.prototype) as ConfigError
		error.message = message
		error.formatted = formatted
		error.name = 'ConfigError'

		return error
	},
})
