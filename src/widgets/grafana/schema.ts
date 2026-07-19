import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const grafanaOptions = defineWidgetOptions(
	'grafana',
	z.strictObject({
		name: z.string().default('Grafana').describe('Display name for the widget.'),
		grafanaUrl: z.url().describe('Base URL of the Grafana instance'),
		datasourceUid: z.string().describe('UID of the datasource to query through Grafana'),
		token: z
			.string()
			.optional()
			.describe('Grafana service account token for instances that require authentication.'),
		icon: z.string().optional().describe('Custom icon URL. Defaults to the Grafana logo if not set.'),
		queries: z
			.array(
				z.strictObject({
					query: z.string().describe('The PromQL query to execute.'),
					label: z.string().describe('Display label for this query result.'),
					unit: z
						.string()
						.optional()
						.describe('Optional unit to display after the value (e.g. Mbps, ms, %).'),
				}),
			)
			.min(1)
			.max(3)
			.describe('Array of PromQL queries with labels (1-3 items).'),
		refreshInterval: z
			.number()
			.min(ms('5s'))
			.default(ms('30s'))
			.describe('Interval in milliseconds to refresh data.'),
	}),
)
