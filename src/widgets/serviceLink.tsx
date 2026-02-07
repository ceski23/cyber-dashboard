import z from 'zod'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
	Component: ({ options: { status, url, icon, name, description }, columns }) => {
		const { data } = useServiceStatus(status?.provider, status?.service)

		return (
			<Card
				style={{ gridColumn: `span ${columns ?? 1}` }}
				render={
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
					/>
				}
			>
				<CardHeader>
					{icon && (
						<img
							src={icon}
							alt={`${name} icon`}
							style={{ width: 32, height: 32 }}
						/>
					)}
					<CardTitle>{name}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				{data && (
					<CardFooter>
						<span className="text-sm">
							Status: {data.label} {data.status === 'available' ? '🟢' : '🔴'}
						</span>
					</CardFooter>
				)}
			</Card>
		)
	},
	provideLinks: ({ url, name, icon }) => [
		{
			type: 'Services',
			label: name,
			url,
			icon,
		},
	],
})
