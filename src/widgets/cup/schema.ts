import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const cupOptions = defineWidgetOptions(
	'cup',
	z.strictObject({
		name: z.string().default('Cup').describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the Cup server instance (e.g. http://cup:8000).'),
		auth: z
			.strictObject({
				username: z.string().describe('Username for Cup API basic auth.'),
				password: z.string().describe('Password for Cup API basic auth.'),
			})
			.optional()
			.describe('Optional basic auth credentials for the Cup API.'),
		refreshInterval: z
			.number()
			.min(ms('1s'))
			.default(ms('5m'))
			.describe('Interval in milliseconds to refresh Cup data. Defaults to 5 minutes.'),
	}),
)
