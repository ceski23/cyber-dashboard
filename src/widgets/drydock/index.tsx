import { Badge } from '#components/badge'
import { Card } from '#components/card'
import { DashboardLink } from '#components/dashboardLink'
import { IconButton } from '#components/iconButton'
import { List } from '#components/list'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { StyledTooltip } from '#components/tooltip'
import { vars } from '#theme.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { match } from 'ts-pattern'
import { styles } from '../cup/style.css'
import { defineWidget } from '../helpers'
import { drydockDataQuery, refreshDrydockData, type DrydockQueryError } from './data'
import { drydockOptions } from './schema'
import * as rowStyles from './style.css'
import { getRowStatus, getUpdateType } from './utils'

const DRYDOCK_ICON_URL = 'https://cdn.jsdelivr.net/gh/selfhst/icons/webp/drydock.webp'

export const drydockWidget = defineWidget({
	type: 'drydock',
	optionsSchema: drydockOptions,
	loader: async (queryClient, { url, refreshInterval, auth }) => {
		await queryClient.prefetchQuery(drydockDataQuery(url, refreshInterval, auth))
	},
	Component: ({ options: { name, url, refreshInterval, auth }, columns }) => {
		const queryClient = useQueryClient()
		const query = useQuery(drydockDataQuery(url, refreshInterval, auth))
		const refresh = useMutation<void, DrydockQueryError>({
			mutationFn: () => refreshDrydockData({ data: { baseUrl: url, auth } }),
			onSuccess: () => queryClient.invalidateQueries(drydockDataQuery(url, refreshInterval, auth)),
		})

		if (query.error) {
			throw new Error('error' in query.error ? query.error.error : query.error.message)
		}

		const updates = query.data?.metrics.updates ?? 0
		const glowStatus = match({ loading: query.isLoading, updates })
			.with({ loading: true }, () => 'loading' as const)
			.when(
				({ updates }) => updates > 0,
				() => 'warning' as const,
			)
			.otherwise(() => 'ok' as const)

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns}` }}
			>
				<div className={styles.glow({ status: glowStatus })} />
				<Card.Header
					className={styles.header}
					label={name}
					labelHref={url}
					icon={
						<img
							src={DRYDOCK_ICON_URL}
							alt="Drydock"
							className={styles.icon}
						/>
					}
				>
					<div className={styles.headerActions}>
						{!query.isLoading && updates > 0 && (
							<Badge
								variant="warning"
								text="Updates available"
							/>
						)}
						<StyledTooltip
							delay={500}
							content={
								refresh.error
									? 'error' in refresh.error
										? refresh.error.error
										: refresh.error.message
									: 'Check for updates'
							}
						>
							<IconButton
								className={styles.refreshButton}
								onClick={() => refresh.mutate()}
								disabled={refresh.isPending}
								aria-label="Check for updates"
							>
								<RefreshCwIcon
									size={14}
									className={styles.refreshIcon({ loading: refresh.isPending })}
								/>
							</IconButton>
						</StyledTooltip>
						{refresh.isError && (
							<Badge
								variant="error"
								text="Refresh failed"
							/>
						)}
					</div>
				</Card.Header>
				{match(query)
					.with({ status: 'pending' }, () => (
						<>
							<Stat.Row
								columns={4}
								className={styles.statsRow}
							>
								{Array.from({ length: 4 }, (_, skeletonIdx) => (
									<Skeleton
										key={skeletonIdx}
										height={60}
										borderRadius={vars.radius.lg}
									/>
								))}
							</Stat.Row>
							<List.Root>
								{Array.from({ length: 5 }, (_, skeletonIdx) => (
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
											width={44}
											height={14}
										/>
									</List.Item>
								))}
							</List.Root>
						</>
					))
					.otherwise(({ data }) => (
						<>
							<Stat.Row
								columns={4}
								className={styles.statsRow}
							>
								<Stat.Item
									value={String(data.metrics.monitored)}
									label="Monitored"
								/>
								<Stat.Item
									value={String(data.metrics.upToDate)}
									label="Up to date"
								/>
								<Stat.Item
									value={String(data.metrics.updates)}
									label="Updates"
								/>
								<Stat.Item
									value={String(data.metrics.unknown)}
									label="Unknown / errors"
								/>
							</Stat.Row>
							<List.Root>
								{data.containers.length === 0 ? (
									<div className={styles.empty}>No monitored containers</div>
								) : (
									data.containers.map(container => {
										const updateType = getUpdateType(container)
										const label = (container.displayName ?? '').trim() || container.name
										const link = container.result?.link
										const newTag = container.updateKind?.remoteValue ?? container.result?.tag
										const updateLabel =
											updateType === 'digest' ? newTag?.replace(/^sha256:/i, '') : newTag

										return (
											<List.Item
												key={`${container.agent ?? ''}:${container.watcher ?? ''}:${container.id}`}
											>
												<span
													className={styles.statusDot({ status: getRowStatus(container) })}
													title={container.error?.message ?? getRowStatus(container)}
												/>
												{link != null && /^https?:\/\//i.test(link) ? (
													<DashboardLink
														href={link}
														rel="noopener noreferrer"
														className={styles.imageRef({ withLink: true })}
													>
														{label}
													</DashboardLink>
												) : (
													<span className={styles.imageRef({ withLink: false })}>
														{label}
													</span>
												)}
												{container.updateAvailable === true && (
													<div className={rowStyles.updateDetails}>
														{newTag != null && (
															<span
																className={rowStyles.updateValue}
																title={newTag}
															>
																{updateLabel}
															</span>
														)}
														{updateType && (
															<span
																className={`${styles.updateBadge({ type: updateType })} ${rowStyles.updateBadge}`}
															>
																{updateType}
															</span>
														)}
													</div>
												)}
											</List.Item>
										)
									})
								)}
							</List.Root>
						</>
					))}
			</Card.Root>
		)
	},
	provideLinks: ({ url, name }) => [{ type: 'Services', label: name, url, icon: DRYDOCK_ICON_URL }],
})
