import { useServiceStatus } from '#services/status'
import { Tooltip } from '@base-ui/react/tooltip'
import { isNotNil } from 'es-toolkit'
import { match } from 'ts-pattern'

import { defineWidget } from '../helpers'

import { serviceLinkOptions } from './schema'
import { styles } from './style.css'

export const serviceLink = defineWidget({
	type: 'service-link',
	optionsSchema: serviceLinkOptions,
	Component: ({ options: { status, url, icon, name, description }, columns }) => {
		const statusQuery = useServiceStatus(status?.provider, status?.service)
		const statusDot = match(statusQuery)
			.with({ status: 'pending' }, () => ({
				dotClass: styles.statusDot({ status: 'pending' }),
				label: 'Loading...',
			}))
			.with({ status: 'error' }, ({ error }) => ({
				dotClass: styles.statusDot({ status: 'unavailable' }),
				label: error.message,
			}))
			.with({ status: 'success' }, ({ data }) =>
				match(data)
					.with({ status: 'available' }, ({ label }) => ({
						dotClass: styles.statusDot({ status: 'available' }),
						label,
					}))
					.with({ status: 'unavailable' }, ({ label }) => ({
						dotClass: styles.statusDot({ status: 'unavailable' }),
						label,
					}))
					.with({ status: 'pending' }, ({ label }) => ({
						dotClass: styles.statusDot({ status: 'pending' }),
						label,
					}))
					.with({ status: 'unknown' }, ({ label }) => ({
						dotClass: styles.statusDot({ status: 'unknown' }),
						label,
					}))
					.exhaustive(),
			)
			.exhaustive()

		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.root({ status: statusQuery.data?.status })}
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
				<Tooltip.Root>
					<Tooltip.Trigger
						delay={100}
						render={<span className={statusDot.dotClass} />}
					/>
					<Tooltip.Portal>
						<Tooltip.Positioner
							sideOffset={8}
							side="top"
						>
							<Tooltip.Popup className={styles.tooltipPopup}>{statusDot.label}</Tooltip.Popup>
						</Tooltip.Positioner>
					</Tooltip.Portal>
				</Tooltip.Root>
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
