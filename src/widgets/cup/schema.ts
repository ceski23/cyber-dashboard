import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const cupOptions = defineWidgetOptions(
	'cup',
	z.strictObject({
		name: z.string().default('Cup').describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the Cup server instance (e.g. http://cup:8000).'),
		refreshInterval: z
			.number()
			.min(ms('1s'))
			.default(ms('5m'))
			.describe('Interval in milliseconds to refresh Cup data. Defaults to 5 minutes.'),
	}),
)
