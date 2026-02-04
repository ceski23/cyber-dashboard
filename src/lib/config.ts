import { z } from 'zod'

import { widgets } from '@/widgets'

export const configSchema = z.strictObject({
	$schema: z.string().describe('The schema to verify this document against.').optional(),
	title: z.string().describe('The title of the dashboard.').optional(),
	widgets: z
		.array(z.union(Object.values(widgets).map(widget => widget.schema)))
		.describe('The list of widgets to display on the dashboard.'),
})

export type Config = z.infer<typeof configSchema>
