import { StyledTooltip } from '#components/tooltip'
import { serviceStatusQuery } from '#services/status'
import { useQuery } from '@tanstack/react-query'
import { isNotNil } from 'es-toolkit'
import { match } from 'ts-pattern'
import { defineWidget } from '../helpers'
import { serviceLinkOptions } from './schema'
import { styles } from './style.css'

export const serviceLink = defineWidget({
	type: 'service-link',
	optionsSchema: serviceLinkOptions,
	// loader: async (queryClient, { status }) => {
	// 	if (isNotNil(status)) {
	// 		void queryClient.prefetchQuery(serviceStatusQuery(status.provider, status.service))
	// 	}
	// },
	Component: ({ options: { status, url, icon, name, description }, columns }) => {
		const statusQuery = useQuery(serviceStatusQuery(status?.provider, status?.service))
		const statusDot = match(statusQuery)
			.with({ status: 'pending' }, () => ({
				dotClass: styles.statusDot({ status: 'pending' }),
				label: 'Loading...',
				status: undefined,
			}))
			.with({ status: 'error' }, ({ error }) => ({
				dotClass: styles.statusDot({ status: 'unavailable' }),
				label: error.message,
				status: 'unavailable' as const,
			}))
			.with({ status: 'success' }, ({ data }) =>
				match(data)
					.with({ status: 'available' }, ({ label }) => ({
						dotClass: styles.statusDot({ status: 'available' }),
						label,
						status: 'available' as const,
					}))
					.with({ status: 'unavailable' }, ({ label }) => ({
						dotClass: styles.statusDot({ status: 'unavailable' }),
						label,
						status: 'unavailable' as const,
					}))
					.with({ status: 'pending' }, ({ label }) => ({
						dotClass: styles.statusDot({ status: 'pending' }),
						label,
						status: undefined,
					}))
					.with({ status: 'unknown' }, ({ label }) => ({
						dotClass: styles.statusDot({ status: 'unknown' }),
						label,
						status: undefined,
					}))
					.exhaustive(),
			)
			.exhaustive()

		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.root({ status: statusDot.status })}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				{isNotNil(icon) && (
					<img
						src={icon}
						alt={`${name} icon`}
						className={styles.icon}
					/>
				)}
				<div className={styles.meta}>
					<span className={styles.name}>{name}</span>
					{isNotNil(description) && <span className={styles.description}>{description}</span>}
				</div>
				{status && (
					<StyledTooltip content={statusDot.label}>
						<span className={statusDot.dotClass} />
					</StyledTooltip>
				)}
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
