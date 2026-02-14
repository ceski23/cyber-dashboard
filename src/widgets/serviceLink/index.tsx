import { isNotNil } from 'es-toolkit'
import { match } from 'ts-pattern'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useServiceStatus } from '@/services/status/useServiceStatus'

import { defineWidget } from '../helpers'

import { serviceLinkOptions } from './schema'

export const serviceLink = defineWidget({
	type: 'service-link',
	optionsSchema: serviceLinkOptions,
	Component: ({ options: { status, url, icon, name, description }, columns }) => {
		const statusQuery = useServiceStatus(status?.provider, status?.service)

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
					{isNotNil(icon) && (
						<img
							src={icon}
							alt={`${name} icon`}
							style={{ width: 32, height: 32 }}
						/>
					)}
					<CardTitle>{name}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				{match(statusQuery)
					.with({ status: 'pending', isEnabled: true }, () => (
						<CardFooter>
							<span className="text-sm">Status: Loading... ⚫</span>
						</CardFooter>
					))
					.with({ status: 'error' }, ({ error }) => (
						<CardFooter>
							<span className="text-sm">Status: {error.message} 🔴</span>
						</CardFooter>
					))
					.with({ status: 'success' }, ({ data }) => (
						<CardFooter>
							<span className="text-sm">
								Status: {data.label} {data.status === 'available' ? '🟢' : '🔴'}
							</span>
						</CardFooter>
					))
					.otherwise(() => null)}
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
