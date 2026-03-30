import { Badge } from '#components/badge'
import { Card } from '#components/card'
import { List } from '#components/list'
import { Skeleton } from '#components/skeleton'
import { StyledTooltip } from '#components/tooltip'
import { useQuery } from '@tanstack/react-query'
import { groupBy } from 'es-toolkit'
import { Fragment } from 'react'
import { match } from 'ts-pattern'
import { defineWidget } from '../helpers'
import { gatusWidgetQuery } from './data'
import { gatusOptions } from './schema'
import { styles } from './style.css'
import { formatDuration } from './utils'

const GATUS_ICON_URL = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/gatus.svg'
const SKELETON_ROW_COUNT = 5

export const gatusWidget = defineWidget({
	type: 'gatus',
	optionsSchema: gatusOptions,
	loader: async (queryClient, { url, refreshInterval }) => {
		await queryClient.prefetchQuery(gatusWidgetQuery(url, refreshInterval))
	},
	Component: ({ options: { name, url, refreshInterval }, columns }) => {
		const { data: endpoints = [], error, isLoading } = useQuery(gatusWidgetQuery(url, refreshInterval))

		if (error) throw new Error(`Failed to load Gatus data: ${error.message}`)

		const upCount = endpoints.filter(endpoint => endpoint.status === 'available').length
		const totalCount = endpoints.length
		const unavailableEndpoints = endpoints.filter(endpoint => endpoint.status !== 'available')
		const badgeStatus = match({ totalCount, upCount })
			.with({ totalCount: 0 }, () => 'warning' as const)
			.when(
				({ upCount, totalCount }) => upCount === totalCount,
				() => 'success' as const,
			)
			.with({ upCount: 0 }, () => 'error' as const)
			.otherwise(() => 'warning' as const)
		const grouped = groupBy(endpoints, endpoint => endpoint.group ?? '')
		const hasGroups = Object.keys(grouped).some(group => group !== '')

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<Card.Header
					className={styles.header}
					icon={
						<img
							src={GATUS_ICON_URL}
							alt="Gatus"
							className={styles.icon}
						/>
					}
					label={name}
					labelHref={url}
				>
					{totalCount > 0 && unavailableEndpoints.length > 0 ? (
						<StyledTooltip
							side="bottom"
							align="end"
							content={
								<div className={styles.badgeTooltip}>
									<div className={styles.badgeTooltipLabel}>Unavailable</div>
									<ul className={styles.badgeTooltipList}>
										{unavailableEndpoints.map(endpoint => (
											<li
												key={endpoint.key}
												className={styles.badgeTooltipItem}
											>
												<span className={styles.badgeTooltipDot({ status: endpoint.status })} />
												{endpoint.name}
											</li>
										))}
									</ul>
								</div>
							}
						>
							<Badge
								variant={badgeStatus}
								text={`${upCount} / ${totalCount}`}
							/>
						</StyledTooltip>
					) : totalCount > 0 ? (
						<Badge
							variant={badgeStatus}
							text={`${upCount} / ${totalCount}`}
						/>
					) : null}
				</Card.Header>

				<List.Root>
					{isLoading ? (
						<>
							<List.Item>
								<Skeleton
									width={100}
									height={14}
									className={styles.skeletonGroupHeader}
								/>
							</List.Item>
							{Array.from({ length: SKELETON_ROW_COUNT }, (_, skeletonIdx) => (
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
										width={36}
										height={14}
									/>
								</List.Item>
							))}
						</>
					) : (
						Object.entries(grouped).map(([group, items]) => (
							<Fragment key={group}>
								{hasGroups && group !== '' && <div className={styles.group}>{group}</div>}
								{items.map(endpoint => {
									const historyTotal = endpoint.history.length
									const passCount = endpoint.history.filter(check => check.success).length
									const avgMs =
										historyTotal > 0
											? Math.round(
													endpoint.history.reduce((sum, check) => sum + check.durationMs, 0) /
														historyTotal,
												)
											: 0

									return (
										<StyledTooltip
											key={endpoint.key}
											align="start"
											content={
												<div className={styles.tooltipContent}>
													<div className={styles.tooltipName}>{endpoint.name}</div>
													{historyTotal > 0 && (
														<>
															<div className={styles.historyBlocks}>
																{endpoint.history.map((check, checkIdx) => (
																	<span
																		key={checkIdx}
																		className={styles.historyBlock({
																			status: check.success ? 'pass' : 'fail',
																		})}
																	/>
																))}
															</div>
															<div className={styles.historyStats}>
																{passCount}/{historyTotal} passed · avg{' '}
																{formatDuration(avgMs)}
															</div>
														</>
													)}
												</div>
											}
											sideOffset={6}
										>
											<List.Item className={styles.row}>
												<span className={styles.statusDot({ status: endpoint.status })} />
												<a
													href={new URL(`endpoints/${endpoint.key}`, url).toString()}
													rel="noopener noreferrer"
													className={styles.rowLink}
												>
													{endpoint.name}
												</a>
												<span className={styles.duration}>
													{endpoint.status !== 'unknown'
														? formatDuration(endpoint.durationMs)
														: '—'}
												</span>
											</List.Item>
										</StyledTooltip>
									)
								})}
							</Fragment>
						))
					)}
				</List.Root>
			</Card.Root>
		)
	},
	provideLinks: ({ url, name }) => [
		{
			type: 'Services',
			label: name,
			url,
			icon: GATUS_ICON_URL,
		},
	],
})
