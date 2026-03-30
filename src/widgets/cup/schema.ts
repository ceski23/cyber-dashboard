import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const cupOptions = defineWidgetOptions(
	'cup',
	z.strictObject({
		name: z.string().default('CUP').describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the CUP server instance (e.g. http://cup:8000).'),
		auth: z
			.strictObject({
				username: z.string().describe('Username for CUP API basic auth.'),
				password: z.string().describe('Password for CUP API basic auth.'),
			})
			.optional()
			.describe('Optional basic auth credentials for the CUP API.'),
		refreshInterval: z
			.number()
			.min(ms('1s'))
			.default(ms('5m'))
			.describe('Interval in milliseconds to refresh CUP data. Defaults to 5 minutes.'),
	}),
)
