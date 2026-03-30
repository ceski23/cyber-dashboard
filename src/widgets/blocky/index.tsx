import { Badge } from '#components/badge'
import { Card } from '#components/card'
import { IconButton } from '#components/iconButton'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { StyledTooltip } from '#components/tooltip'
import { vars } from '#theme.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isNotNil } from 'es-toolkit'
import { ShieldCheckIcon, ShieldOffIcon } from 'lucide-react'
import { match, P } from 'ts-pattern'
import { defineWidget } from '../helpers'
import { blockyDataQuery, toggleBlocking } from './data'
import { blockyOptions } from './schema'
import { styles } from './style.css'
import { formatAutoEnable, formatQueriesCount, formatResponseTime, useAutoEnableCountdown } from './utils'

const BLOCKY_ICON_URL = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/blocky.svg'

export const blockyWidget = defineWidget({
	type: 'blocky',
	optionsSchema: blockyOptions,
	loader: async (queryClient, { refreshInterval, url }) => {
		await queryClient.prefetchQuery(blockyDataQuery(url, refreshInterval))
	},
	Component: ({ options: { name, url, refreshInterval }, columns }) => {
		const queryClient = useQueryClient()
		const { data, isLoading, error } = useQuery(blockyDataQuery(url, refreshInterval))
		const mutation = useMutation({
			mutationFn: (enable: boolean) => toggleBlocking({ data: { baseUrl: url, enable } }),
			onSuccess: () => queryClient.invalidateQueries(blockyDataQuery(url, refreshInterval)),
		})

		if (error) throw new Error(`Failed to load Blocky data: ${error.message}`)

		const isEnabled = data?.status.enabled ?? false
		const remainingSec = useAutoEnableCountdown(data?.autoEnableAt)
		const disabledGroups = data?.status.disabledGroups ?? []
		const metrics = data?.metrics
		const blockedPercent =
			isNotNil(metrics) && metrics.totalQueries > 0 ? metrics.blockedQueries / metrics.totalQueries : 0
		const status = match({ isLoading, isEnabled })
			.with({ isLoading: true }, () => ({ value: 'loading' as const, label: 'Loading…' }))
			.with({ isEnabled: true }, () => ({ value: 'enabled' as const, label: 'Active' }))
			.otherwise(() => ({ value: 'disabled' as const, label: 'Disabled' }))

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns}` }}
			>
				<div className={styles.glow({ status: status.value })} />

				<Card.Header
					className={styles.header}
					label={name}
					labelHref={url}
					icon={
						<img
							src={BLOCKY_ICON_URL}
							alt="Blocky"
							className={styles.icon}
						/>
					}
				>
					<div className={styles.headerActions}>
						{match({ isLoading, hasDisabledGroups: disabledGroups.length > 0 })
							.with({ isLoading: false, hasDisabledGroups: true }, () => (
								<StyledTooltip
									side="bottom"
									content={
										<div className={styles.tooltipGroups}>
											<div className={styles.tooltipTitle}>Paused groups</div>
											<div className={styles.tooltipGroupList}>
												{disabledGroups.map(group => (
													<div
														key={group}
														className={styles.tooltipGroup}
													>
														<span className={styles.tooltipGroupDot} />
														{group}
													</div>
												))}
											</div>
										</div>
									}
								>
									<Badge
										variant={isEnabled ? 'success' : 'error'}
										text={status.label}
										withDot
									/>
								</StyledTooltip>
							))
							.with({ isLoading: false }, () => (
								<Badge
									variant={isEnabled ? 'success' : 'error'}
									text={status.label}
									withDot
								/>
							))
							.otherwise(() => null)}

						{!isLoading && (
							<StyledTooltip
								delay={500}
								content={isEnabled ? 'Disable blocking' : 'Enable blocking'}
							>
								<IconButton
									className={styles.toggleButton({ enabled: isEnabled })}
									onClick={() => mutation.mutate(!isEnabled)}
									disabled={mutation.isPending}
									aria-label={isEnabled ? 'Disable blocking' : 'Enable blocking'}
								>
									{isEnabled ? <ShieldCheckIcon size={16} /> : <ShieldOffIcon size={16} />}
									{isNotNil(remainingSec) && (
										<span className={styles.timerText}>{formatAutoEnable(remainingSec)}</span>
									)}
								</IconButton>
							</StyledTooltip>
						)}
					</div>
				</Card.Header>

				<Stat.Row
					columns={3}
					className={styles.statsRow}
				>
					{match({ isLoading, data, metrics })
						.with({ isLoading: true }, () =>
							Array.from({ length: 3 }).map((_, index) => (
								<Skeleton
									key={index}
									borderRadius={vars.radius.lg}
									height={56}
								/>
							)),
						)
						.with({ isLoading: false, data: P.nonNullable, metrics: P.nonNullable }, ({ metrics }) => (
							<>
								<Stat.Item
									value={formatQueriesCount(metrics.totalQueries)}
									label="Queries"
								/>
								<Stat.Item
									value={blockedPercent.toLocaleString(undefined, {
										maximumFractionDigits: 2,
										style: 'percent',
									})}
									label="Blocked"
								/>
								<Stat.Item
									value={formatResponseTime(metrics.avgResponseMs)}
									label="Avg res time"
								/>
							</>
						))
						.otherwise(() => null)}
				</Stat.Row>
			</Card.Root>
		)
	},
	provideLinks: ({ url, name }) => [
		{
			type: 'Services',
			label: name,
			url,
			icon: BLOCKY_ICON_URL,
		},
	],
})
