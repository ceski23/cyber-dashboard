import { useServiceStatus } from '#services/status'
import { isNotNil } from 'es-toolkit'
import { match } from 'ts-pattern'

import { defineWidget } from '../helpers'

import { serviceLinkOptions } from './schema'

export const serviceLink = defineWidget({
	type: 'service-link',
	optionsSchema: serviceLinkOptions,
	Component: ({ options: { status, url, icon, name, description }, columns }) => {
		const statusQuery = useServiceStatus(status?.provider, status?.service)

		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div>
					{isNotNil(icon) && (
						<img
							src={icon}
							alt={`${name} icon`}
							style={{ width: 32, height: 32 }}
						/>
					)}
					<div>{name}</div>
					<div>{description}</div>
				</div>
				{match(statusQuery)
					.with({ status: 'pending', isEnabled: true }, () => (
						<div>
							<span className="text-sm">Status: Loading... ⚫</span>
						</div>
					))
					.with({ status: 'error' }, ({ error }) => (
						<div>
							<span className="text-sm">Status: {error.message} 🔴</span>
						</div>
					))
					.with({ status: 'success' }, ({ data }) => (
						<div>
							<span className="text-sm">
								Status: {data.label} {data.status === 'available' ? '🟢' : '🔴'}
							</span>
						</div>
					))
					.otherwise(() => null)}
			</a>
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
