import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const traefikOptions = defineWidgetOptions(
	'traefik',
	z.strictObject({
		name: z.string().default('Traefik').describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the Traefik instance (e.g. http://traefik:8080).'),
		auth: z
			.strictObject({
				username: z.string().describe('Username for Traefik API basic auth.'),
				password: z.string().describe('Password for Traefik API basic auth.'),
			})
			.optional()
			.describe('Optional basic auth credentials for the Traefik API.'),
		refreshInterval: z
			.number()
			.min(ms('1s'))
			.default(ms('30s'))
			.describe('Interval in milliseconds to refresh Traefik data.'),
	}),
)
