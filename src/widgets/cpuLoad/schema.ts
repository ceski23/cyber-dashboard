import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const cpuLoadOptions = defineWidgetOptions(
	'cpu-load',
	z.strictObject({
		refreshInterval: z.number().min(1000).default(5000).describe('Interval (in ms) to refresh CPU data.'),
		showGraph: z.boolean().optional().default(true).describe('Whether to display the CPU usage graph.'),
	}),
)
