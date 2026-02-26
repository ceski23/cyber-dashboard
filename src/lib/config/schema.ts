import { statusProviderSchema } from '#services/status/schema'
import { widgetsSchema } from '#widgets/schemas'
import { z } from 'zod'

export const configSchema = z.strictObject({
	$schema: z.string().describe('The schema to verify this document against.').optional(),
	title: z.string().describe('The title of the dashboard.').optional(),
	widgets: z
		.array(
			z.union([
				widgetsSchema,
				z.strictObject({
					name: z.string().optional().describe('The name of the group.'),
					columns: z.number().describe('The number of columns in the group.').optional(),
					widgets: z.array(widgetsSchema),
				}),
			]),
		)
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
	auth: z
		.discriminatedUnion('type', [
			z.strictObject({
				type: z.literal('basic').describe('Basic authentication.'),
				username: z.string().describe('The username for basic authentication.'),
				password: z.string().describe('The password for basic authentication.'),
			}),
			z.strictObject({
				type: z.literal('oidc').describe('OpenID Connect authentication.'),
				issuer: z.url().describe('The OIDC issuer URL.'),
				clientId: z.string().describe('The OIDC client ID.'),
				clientSecret: z.string().describe('The OIDC client secret.'),
			}),
		])
		.optional()
		.describe('Authentication configuration.'),
	baseUrl: z
		.url()
		.describe('The base URL of the dashboard. Used for generating links and configuring authentication.'),
})

export type DashboardConfig = z.infer<typeof configSchema>
