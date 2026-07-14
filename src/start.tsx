import { configErrorAdapter } from '#lib/config/serialization'
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => ({
	defaultSsr: true,
	serializationAdapters: [configErrorAdapter],
}))
