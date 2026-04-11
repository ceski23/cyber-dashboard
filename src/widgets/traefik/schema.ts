import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const traefikOptions = defineWidgetOptions(
	'traefik',
	z.strictObject({
		name: z.string().default('Traefik').describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the Traefik instance (e.g. http://traefik:8080).'),
		refreshInterval: z
			.number()
			.min(ms('1s'))
			.default(ms('30s'))
			.describe('Interval in milliseconds to refresh Traefik data.'),
	}),
)
