import { z } from 'zod'

import { statusProviderSchema } from '@/services/status'
import { widgets } from '@/widgets'

export const configSchema = z.strictObject({
	$schema: z.string().describe('The schema to verify this document against.').optional(),
	title: z.string().describe('The title of the dashboard.').optional(),
	widgets: z
		.array(z.union(Object.values(widgets).map(widget => widget.schema)))
		.describe('The list of widgets to display on the dashboard.'),
	statusProviders: z
		.record(
			z.string().describe('The name of the status provider.'),
			statusProviderSchema.describe('Status providers options.'),
		)
		.optional(),
	units: z
		.union([
			z.literal('metric').describe('Use metric units (Celsius, hPa, etc.).'),
			z.literal('imperial').describe('Use imperial units (Fahrenheit, inHg, etc.).'),
		])
		.default('metric')
		.describe('The units to use for weather data. If not specified, the default is metric.'),
})

export type Config = z.infer<typeof configSchema>
