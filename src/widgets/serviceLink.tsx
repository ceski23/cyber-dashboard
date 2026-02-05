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
				connectionName: z.string().describe('Name of the connection to check service status.'),
				serviceName: z.string().describe('Name of the service to check status for.'),
			})
			.optional()
			.describe('Service status configuration.'),
	}),
	Component: ({ options: { status, url, icon, name, description } }) => {
		const { data } = useServiceStatus(status?.connectionName, status?.serviceName)

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
