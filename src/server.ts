import { getConfig } from '#lib/config'
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import z, { prettifyError } from 'zod'

export default createServerEntry({
	fetch: request => handler.fetch(request),
})

try {
	await getConfig()
} catch (error) {
	if (error instanceof z.ZodError) {
		console.error('Config validation error:')
		console.error(prettifyError(error))
	} else {
		console.error('Error loading config:', error)
	}

	process.exit(1)
}
