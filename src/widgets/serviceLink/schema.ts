import { z } from 'zod'

import { defineWidgetOptions } from '../helpers'

export const serviceLinkOptions = defineWidgetOptions(
	'service-link',
	z.strictObject({
		name: z.string().describe('Name of the service to link to.'),
		description: z.string().optional().describe('Optional description of the service.'),
		icon: z.url().optional().describe('Optional icon URL for the service.'),
		url: z.url().describe('URL to link to the service.'),
		status: z
			.strictObject({
				provider: z
					.string()
					.describe(
						'Name of the status provider to use for this service. Must match a provider defined in the dashboard configuration.',
					),
				service: z
					.string()
					.describe('Identifier of the service to check status for (depends on the provider).'),
			})
			.optional()
			.describe('Service status configuration.'),
	}),
)
