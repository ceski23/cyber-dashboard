import { Badge } from '#components/badge'
import { Card } from '#components/card'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { useQuery } from '@tanstack/react-query'
import { match, P } from 'ts-pattern'
import { defineWidget } from '../helpers'
import { proxmoxDataQuery } from './data'
import { proxmoxOptions } from './schema'
import { styles } from './style.css'
import { formatBytes, formatUptime } from './utils'

const PROXMOX_ICON_URL = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/proxmox.svg'

const getVariant = (percent: number) =>
	match(percent)
		.with(P.number.gte(90), () => 'error' as const)
		.with(P.number.gte(70), () => 'warning' as const)
		.otherwise(() => 'ok' as const)

export const proxmoxWidget = defineWidget({
	type: 'proxmox',
	optionsSchema: proxmoxOptions,
	loader: async (queryClient, { url, node, apiToken, refreshInterval }) => {
		await queryClient.prefetchQuery(proxmoxDataQuery(url, node, apiToken, refreshInterval))
	},
	Component: ({ options: { name, url, node, apiToken, refreshInterval }, columns }) => {
		const proxmoxQuery = useQuery(proxmoxDataQuery(url, node, apiToken, refreshInterval))

		if (proxmoxQuery.error) throw new Error(`Failed to load Proxmox data: ${proxmoxQuery.error.message}`)

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<Card.Header
					className={styles.header}
					label={name ?? node}
					labelHref={url}
					icon={
						<img
							src={PROXMOX_ICON_URL}
							alt="Proxmox"
							className={styles.icon}
						/>
					}
				>
					{proxmoxQuery.data && (
						<Badge
							variant="neutral"
							text={formatUptime(proxmoxQuery.data.uptime)}
						/>
					)}
				</Card.Header>

				<div className={styles.metrics({ status: proxmoxQuery.status })}>
					{match(proxmoxQuery)
						.with({ status: 'pending' }, () => (
							<>
								<Skeleton
									width="2rem"
									height={12}
								/>
								<Skeleton
									height={6}
									borderRadius="9999px"
								/>
								<Skeleton
									width="5rem"
									height={12}
								/>
								<Skeleton
									width="2rem"
									height={12}
								/>
								<Skeleton
									height={6}
									borderRadius="9999px"
								/>
								<Skeleton
									width="5rem"
									height={12}
								/>
								<Skeleton
									width="2rem"
									height={12}
								/>
								<Skeleton
									height={6}
									borderRadius="9999px"
								/>
								<Skeleton
									width="5rem"
									height={12}
								/>
							</>
						))
						.otherwise(({ data }) => {
							const cpuPercent = Math.round(data.cpu * 100)
							const memPercent = Math.round((data.memory.used / data.memory.total) * 100)
							const storagePct =
								data.storage != null ? Math.round((data.storage.used / data.storage.total) * 100) : 0
							return (
								<>
									<span className={styles.metricLabel}>CPU</span>
									<div className={styles.progressTrack}>
										<div
											className={styles.progressBar({ variant: getVariant(cpuPercent) })}
											style={{ width: `${cpuPercent}%` }}
										/>
									</div>
									<span className={styles.metricValue({ variant: getVariant(cpuPercent) })}>
										{cpuPercent}%
									</span>

									<span className={styles.metricLabel}>RAM</span>
									<div className={styles.progressTrack}>
										<div
											className={styles.progressBar({ variant: getVariant(memPercent) })}
											style={{ width: `${memPercent}%` }}
										/>
									</div>
									<span className={styles.metricValue({ variant: getVariant(memPercent) })}>
										{formatBytes(data.memory.used)}
										<span className={styles.metricValueMeta}>
											{' '}
											/ {formatBytes(data.memory.total)}
										</span>
									</span>

									{data.storage != null && (
										<>
											<span className={styles.metricLabel}>Disk</span>
											<div className={styles.progressTrack}>
												<div
													className={styles.progressBar({ variant: getVariant(storagePct) })}
													style={{ width: `${storagePct}%` }}
												/>
											</div>
											<span className={styles.metricValue({ variant: getVariant(storagePct) })}>
												{formatBytes(data.storage.used)}
												<span className={styles.metricValueMeta}>
													{' '}
													/ {formatBytes(data.storage.total)}
												</span>
											</span>
										</>
									)}
								</>
							)
						})}
				</div>

				<Stat.Row columns={2}>
					{match(proxmoxQuery)
						.with({ status: 'pending' }, () => (
							<>
								<Skeleton height={56} />
								<Skeleton height={56} />
							</>
						))
						.otherwise(({ data }) => (
							<>
								<Stat.Item
									value={`${data.vms.running} / ${data.vms.total}`}
									label="VMs"
								/>
								<Stat.Item
									value={`${data.containers.running} / ${data.containers.total}`}
									label="Containers"
								/>
							</>
						))}
				</Stat.Row>
			</Card.Root>
		)
	},
	provideLinks: ({ url, name, node }) => [
		{
			type: 'Services',
			label: name ?? `Proxmox (${node})`,
			url,
			icon: PROXMOX_ICON_URL,
		},
	],
})
