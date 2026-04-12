import { statusProviderSchema } from '#services/status/schema'
import { widgetsSchema } from '#widgets/schemas'
import { z } from 'zod'

export type DashboardWidget = z.infer<typeof widgetsSchema>

export type DashboardGroup = {
	name?: string
	columns?: number
	widgets: DashboardItem[]
}

export type DashboardStack = {
	type: 'stack'
	columns: number
	widgets: DashboardItem[]
}

export type DashboardItem = DashboardWidget | DashboardGroup | DashboardStack

export const dashboardItemSchema: z.ZodType<DashboardItem> = z.lazy(() =>
	z.union([widgetsSchema, dashboardGroupSchema, dashboardStackSchema]),
)

export const dashboardGroupSchema: z.ZodType<DashboardGroup> = z.strictObject({
	name: z.string().optional().describe('The name of the group.'),
	columns: z.number().min(1).describe('The number of columns in the group.').optional(),
	widgets: z.array(z.lazy(() => dashboardItemSchema)).describe('The widgets to display in the group.'),
})

export const dashboardStackSchema: z.ZodType<DashboardStack> = z.strictObject({
	type: z.literal('stack').describe('The internal layout widget type.'),
	columns: z.number().min(1).default(3).describe('The number of columns the stack spans.'),
	widgets: z.array(z.lazy(() => dashboardItemSchema)).describe('The widgets to display vertically in the stack.'),
})

export const configSchema = z.strictObject({
	$schema: z.string().describe('The schema to verify this document against.').optional(),
	title: z.string().describe('The title of the dashboard.').optional(),
	widgets: z.array(dashboardItemSchema).describe('The list of widgets to display on the dashboard.'),
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
	authentication: z
		.discriminatedUnion('type', [
			z.strictObject({
				type: z.literal('oauth2').describe('OAuth2 authentication.'),
				issuer: z.url().describe('The OAuth2 issuer URL.'),
				clientId: z.string().describe('The OAuth2 client ID.'),
				clientSecret: z.string().describe('The OAuth2 client secret.'),
				scope: z.string().describe('The OAuth2 scopes to request.'),
			}),
		])
		.optional()
		.describe(
			'Authentication configuration for the dashboard. If specified, this will be used to authenticate requests to services and widgets.',
		),
	baseUrl: z
		.url()
		.describe('The base URL of the dashboard. Used for generating links and configuring authentication.'),
})

export type DashboardConfig = z.infer<typeof configSchema>
