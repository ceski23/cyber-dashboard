import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const gatusOptions = defineWidgetOptions(
	'gatus',
	z.strictObject({
		name: z.string().default('Gatus').describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the Gatus instance.'),
		refreshInterval: z
			.number()
			.min(ms('5s'))
			.default(ms('30s'))
			.describe('Interval in milliseconds to refresh Gatus data.'),
	}),
)
