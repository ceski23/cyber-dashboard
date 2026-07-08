import { Badge } from '#components/badge'
import { Card } from '#components/card'
import { List } from '#components/list'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { StyledTooltip } from '#components/tooltip'
import { useQuery } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import { isNotNil } from 'es-toolkit'
import { match } from 'ts-pattern'
import { AdaptiveIcon } from '../../components/AdaptiveIcon'
import { defineWidget } from '../helpers'
import { tailscaleDataQuery } from './data'
import { tailscaleOptions } from './schema'
import { styles } from './style.css'

const TAILSCALE_ICON_URL = {
	dark: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/tailscale-light.svg',
	light: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/tailscale-dark.svg',
}
const TAILSCALE_ADMIN_URL = 'https://login.tailscale.com/admin/machines'

export const tailscaleWidget = defineWidget({
	type: 'tailscale',
	optionsSchema: tailscaleOptions,
	loader: async (queryClient, { apiKey, tailnet, refreshInterval }) => {
		await queryClient.prefetchQuery(tailscaleDataQuery(tailnet, apiKey, refreshInterval))
	},
	Component: ({ options: { name, apiKey, tailnet, refreshInterval }, columns }) => {
		const tailscaleQuery = useQuery(tailscaleDataQuery(tailnet, apiKey, refreshInterval))

		if (tailscaleQuery.error) {
			throw new Error(`Failed to load Tailscale data: ${tailscaleQuery.error.message}`)
		}

		const devices = tailscaleQuery.data ?? []
		const onlineCount = devices.filter(device => device.connectedToControl).length
		const totalCount = devices.length
		const userCount = new Set(devices.map(device => device.user).filter(isNotNil)).size
		const authorizedCount = devices.filter(device => device.authorized === true).length
		const updatesCount = devices.filter(device => device.updateAvailable === true).length
		const badgeStatus = match({ totalCount, onlineCount })
			.with({ totalCount: 0 }, () => 'warning' as const)
			.when(
				({ onlineCount, totalCount }) => onlineCount === totalCount,
				() => 'success' as const,
			)
			.with({ onlineCount: 0 }, () => 'error' as const)
			.otherwise(() => 'warning' as const)

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<Card.Header
					className={styles.header}
					icon={
						<AdaptiveIcon
							src={TAILSCALE_ICON_URL}
							alt="Tailscale"
							className={styles.icon}
						/>
					}
					label={name}
					labelHref={TAILSCALE_ADMIN_URL}
				>
					{totalCount > 0 && (
						<Badge
							variant={badgeStatus}
							text={`${onlineCount} / ${totalCount}`}
						/>
					)}
				</Card.Header>

				<div className={styles.statsRow}>
					<Stat.Row columns={3}>
						{match(tailscaleQuery)
							.with({ status: 'pending' }, () => (
								<>
									<Skeleton height={56} />
									<Skeleton height={56} />
									<Skeleton height={56} />
								</>
							))
							.otherwise(() => (
								<>
									<Stat.Item
										value={String(userCount)}
										label="Users"
									/>
									<Stat.Item
										value={String(authorizedCount)}
										label="Authorized"
									/>
									<Stat.Item
										value={String(updatesCount)}
										label="Updates"
									/>
								</>
							))}
					</Stat.Row>
				</div>

				<List.Root>
					{match(tailscaleQuery)
						.with({ status: 'pending' }, () => (
							<>
								{Array.from({ length: 4 }, (_, skeletonIdx) => (
									<List.Item key={skeletonIdx}>
										<Skeleton
											width={8}
											height={8}
											borderRadius="50%"
										/>
										<Skeleton
											height={14}
											style={{ flex: 1 }}
										/>
										<Skeleton
											width={60}
											height={14}
										/>
									</List.Item>
								))}
							</>
						))
						.otherwise(() => (
							<>
								{devices.map(device => {
									const primaryAddress = device.addresses?.at(0)
									const meta =
										device.lastSeen != null
											? formatDistanceToNow(device.lastSeen, { addSuffix: true })
											: 'Never seen'

									return (
										<List.Item key={device.id}>
											<span
												className={styles.statusDot({ connected: device.connectedToControl })}
											/>
											{isNotNil(primaryAddress) ? (
												<a
													href={new URL(
														`machines/${primaryAddress}`,
														TAILSCALE_ADMIN_URL,
													).toString()}
													target="_blank"
													rel="noopener noreferrer"
													className={styles.rowLink}
												>
													{device.hostname}
												</a>
											) : (
												<span className={styles.rowLink}>{device.hostname}</span>
											)}
											{isNotNil(device.tags) && device.tags.length > 0 && (
												<span className={styles.tagList}>
													{device.tags.map(tag => (
														<span
															key={tag}
															className={styles.tagBadge}
														>
															{tag.replace(/^tag:/, '')}
														</span>
													))}
												</span>
											)}
											{isNotNil(device.lastSeen) ? (
												<StyledTooltip content={format(device.lastSeen, 'PPPPpppp')}>
													<span className={styles.deviceMeta}>{meta}</span>
												</StyledTooltip>
											) : (
												<span className={styles.deviceMeta}>{meta}</span>
											)}
										</List.Item>
									)
								})}
							</>
						))}
				</List.Root>
			</Card.Root>
		)
	},
	provideLinks: ({ name }) => [
		{
			type: 'Services',
			label: name,
			url: TAILSCALE_ADMIN_URL,
			icon: TAILSCALE_ICON_URL,
		},
	],
})
