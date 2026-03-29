import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const blockyOptions = defineWidgetOptions(
	'blocky',
	z.strictObject({
		name: z.string().default('Blocky').describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the Blocky instance (e.g. http://blocky:4000).'),
		refreshInterval: z
			.number()
			.min(1000)
			.default(60_000)
			.describe('Interval in milliseconds to refresh blocking status.'),
	}),
)
