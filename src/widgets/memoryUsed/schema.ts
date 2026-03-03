import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const memoryUsedOptions = defineWidgetOptions(
	'memory-used',
	z.strictObject({
		refreshInterval: z.number().min(1000).default(5000).describe('Interval (in ms) to refresh memory data.'),
		showGraph: z.boolean().optional().default(true).describe('Whether to display the memory usage graph.'),
	}),
)
