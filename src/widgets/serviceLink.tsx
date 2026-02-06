import z from 'zod'

import { useServiceStatus } from '@/services/status'

import { defineWidget } from './helpers'

export const serviceLink = defineWidget({
	type: 'service-link',
	optionsSchema: z.strictObject({
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
	Component: ({ options: { status, url, icon, name, description } }) => {
		const { data } = useServiceStatus(status?.provider, status?.service)

		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
			>
				{icon && (
					<img
						src={icon}
						alt={`${name} icon`}
						style={{ width: 32, height: 32 }}
					/>
				)}
				<div>
					<span>{name}</span>
					{description && <span>{description}</span>}
				</div>
				{data && (
					<span>
						Status: {data.label} {data.status === 'available' ? '🟢' : '🔴'}
					</span>
				)}
			</a>
		)
	},
})
