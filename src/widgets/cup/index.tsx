import { Badge } from '#components/badge'
import { Card } from '#components/card'
import { IconButton } from '#components/iconButton'
import { List } from '#components/list'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { StyledTooltip } from '#components/tooltip'
import { vars } from '#theme.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { match } from 'ts-pattern'
import { defineWidget } from '../helpers'
import { cupDataQuery, refreshCupData } from './data'
import { cupOptions } from './schema'
import { styles } from './style.css'
import { UPDATE_BADGE_LABELS, getRowStatus, getUpdateType } from './utils'

const CUP_ICON_URL = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/cup.svg'
const SKELETON_ROW_COUNT = 5

export const cupWidget = defineWidget({
	type: 'cup',
	optionsSchema: cupOptions,
	loader: async (queryClient, { url, refreshInterval }) => {
		await queryClient.prefetchQuery(cupDataQuery(url, refreshInterval))
	},
	Component: ({ options: { name, url, refreshInterval }, columns }) => {
		const queryClient = useQueryClient()
		const cupQuery = useQuery(cupDataQuery(url, refreshInterval))
		const refresh = useMutation({
			mutationFn: () => refreshCupData({ data: { baseUrl: url } }),
			onSuccess: () => queryClient.invalidateQueries(cupDataQuery(url, refreshInterval)),
		})

		if (cupQuery.error) {
			throw new Error(`Failed to load CUP data: ${cupQuery.error.message}`, {
				cause: cupQuery.error,
			})
		}

		const updatesAvailable = cupQuery.data?.metrics.updates_available ?? 0
		const glowStatus = match({ isLoading: cupQuery.isLoading, updatesAvailable })
			.with({ isLoading: true }, () => 'loading' as const)
			.when(
				({ updatesAvailable }) => updatesAvailable > 0,
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
							src={CUP_ICON_URL}
							alt="CUP"
							className={styles.icon}
						/>
					}
				>
					<div className={styles.headerActions}>
						{!cupQuery.isLoading && updatesAvailable > 0 && (
							<Badge
								variant="warning"
								text="Updates available"
							/>
						)}
						<StyledTooltip
							delay={500}
							content="Force refresh"
						>
							<IconButton
								className={styles.refreshButton}
								onClick={() => refresh.mutate()}
								disabled={refresh.isPending}
								aria-label="Force refresh"
							>
								<RefreshCwIcon
									size={14}
									className={styles.refreshIcon({ loading: refresh.isPending })}
								/>
							</IconButton>
						</StyledTooltip>
					</div>
				</Card.Header>

				{match(cupQuery)
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
									value={String(data.metrics.monitored_images)}
									label="Monitored"
								/>
								<Stat.Item
									value={String(data.metrics.up_to_date)}
									label="Up to date"
								/>
								<Stat.Item
									value={String(data.metrics.updates_available)}
									label="Updates"
								/>
								<Stat.Item
									value={String(data.metrics.unknown)}
									label="Unknown"
								/>
							</Stat.Row>

							<List.Root>
								{data.images.length === 0 ? (
									<div className={styles.empty}>All images up to date</div>
								) : (
									data.images.map(image => {
										const updateType = getUpdateType(image)

										return (
											<List.Item key={image.reference}>
												<span className={styles.statusDot({ status: getRowStatus(image) })} />
												{image.url != null ? (
													<a
														href={image.url}
														target="_blank"
														rel="noopener noreferrer"
														className={styles.imageRef({ withLink: true })}
													>
														{image.reference}
													</a>
												) : (
													<span className={styles.imageRef({ withLink: false })}>
														{image.reference}
													</span>
												)}
												{updateType != null && (
													<span className={styles.updateBadge({ type: updateType })}>
														{UPDATE_BADGE_LABELS[updateType]}
													</span>
												)}
												{image.result.info?.new_tag != null && (
													<span className={styles.newTag}>{image.result.info.new_tag}</span>
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
	provideLinks: ({ url, name }) => [
		{
			type: 'Services',
			label: name,
			url,
			icon: CUP_ICON_URL,
		},
	],
})
