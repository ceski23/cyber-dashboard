import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const drydockOptions = defineWidgetOptions(
	'drydock',
	z.strictObject({
		name: z.string().default('Drydock').describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the Drydock server (e.g. http://drydock:3000).'),
		auth: z
			.object({ username: z.string(), password: z.string() })
			.optional()
			.describe('Optional HTTP Basic authentication credentials.'),
		refreshInterval: z
			.number()
			.min(ms('1s'))
			.default(ms('5m'))
			.describe('Polling interval in milliseconds. Defaults to 5 minutes.'),
	}),
)
