import { Badge } from '#components/badge'
import { Card } from '#components/card'
import { List } from '#components/list'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { vars } from '#theme.css'
import { useQuery } from '@tanstack/react-query'
import { CircleAlertIcon, TriangleAlertIcon } from 'lucide-react'
import { match } from 'ts-pattern'
import { defineWidget } from '../helpers'
import { traefikDataQuery } from './data'
import { traefikOptions } from './schema'
import { styles } from './style.css'
import { getOverallStatus, getStatStatus } from './utils'

const TRAEFIK_ICON_URL = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/traefik.svg'
const SECTIONS = [
	{ key: 'routers', label: 'Routers', url: 'dashboard/#/http/routers' },
	{ key: 'services', label: 'Services', url: 'dashboard/#/http/services' },
	{ key: 'middlewares', label: 'Middlewares', url: 'dashboard/#/http/middlewares' },
] as const

export const traefikWidget = defineWidget({
	type: 'traefik',
	optionsSchema: traefikOptions,
	loader: async (queryClient, { url, auth, refreshInterval }) => {
		await queryClient.prefetchQuery(traefikDataQuery(url, auth, refreshInterval))
	},
	Component: ({ options: { name, url, auth, refreshInterval }, columns }) => {
		const traefikQuery = useQuery(traefikDataQuery(url, auth, refreshInterval))

		if (traefikQuery.error) throw new Error(`Failed to load Traefik data: ${traefikQuery.error.message}`)

		const statusInfo = traefikQuery.data
			? (() => {
					const allStats = [
						traefikQuery.data.routers,
						traefikQuery.data.services,
						traefikQuery.data.middlewares,
					]
					const status = getOverallStatus(allStats)
					const label = match(status)
						.with('error', () => {
							const count = allStats.reduce((sum, stat) => sum + stat.errors, 0)
							return `${count} error${count !== 1 ? 's' : ''}`
						})
						.with('warning', () => {
							const count = allStats.reduce((sum, stat) => sum + stat.warnings, 0)
							return `${count} warning${count !== 1 ? 's' : ''}`
						})
						.with('success', () => 'All healthy')
						.exhaustive()
					return { status, label }
				})()
			: null

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div className={styles.glow({ status: statusInfo?.status ?? 'loading' })} />
				<Card.Header
					className={styles.header}
					icon={
						<img
							src={TRAEFIK_ICON_URL}
							alt="Traefik"
							className={styles.icon}
						/>
					}
					label={name}
					labelHref={url}
				>
					<div className={styles.headerActions}>
						{statusInfo != null && (
							<Badge
								variant={statusInfo.status}
								text={statusInfo.label}
							/>
						)}
					</div>
				</Card.Header>
				{match(traefikQuery)
					.with({ status: 'pending' }, () => (
						<Stat.Row
							columns={3}
							className={styles.statsRow}
						>
							{Array.from({ length: 3 }, (_, statIdx) => (
								<Skeleton
									key={statIdx}
									height={56}
									className={styles.skeletonStatItem}
								/>
							))}
						</Stat.Row>
					))
					.otherwise(({ data }) => (
						<Stat.Row
							columns={3}
							className={styles.statsRow}
						>
							<Stat.Item
								value={String(
									[data.routers, data.services, data.middlewares].reduce(
										(sum, stat) => sum + stat.total - stat.errors - stat.warnings,
										0,
									),
								)}
								label="Healthy"
							/>
							<Stat.Item
								value={String(
									data.routers.warnings + data.services.warnings + data.middlewares.warnings,
								)}
								label="Warnings"
							/>
							<Stat.Item
								value={String(data.routers.errors + data.services.errors + data.middlewares.errors)}
								label="Errors"
							/>
						</Stat.Row>
					))}
				<List.Root>
					{match(traefikQuery)
						.with({ status: 'pending' }, () => (
							<>
								{Array.from({ length: 3 }, (_, skeletonIdx) => (
									<List.Item key={skeletonIdx}>
										<Skeleton
											width={8}
											height={8}
											borderRadius="50%"
										/>
										<Skeleton
											height={14}
											style={{ flex: 1 }}
											borderRadius={vars.radius.md}
										/>
										<Skeleton
											width={28}
											height={14}
											borderRadius={vars.radius.md}
										/>
									</List.Item>
								))}
							</>
						))
						.otherwise(({ data }) => (
							<>
								{SECTIONS.map(section => {
									const stat = data[section.key]
									const status = getStatStatus(stat)

									return (
										<List.Item key={section.key}>
											<span className={styles.statusDot({ status })} />
											<a
												href={new URL(section.url, url).toString()}
												target="_blank"
												rel="noopener noreferrer"
												className={styles.rowLink}
											>
												{section.label}
											</a>
											{stat.errors > 0 && (
												<span className={styles.countPill({ tone: 'error' })}>
													<CircleAlertIcon size={12} />
													{stat.errors}
												</span>
											)}
											{stat.warnings > 0 && (
												<span className={styles.countPill({ tone: 'warning' })}>
													<TriangleAlertIcon size={12} />
													{stat.warnings}
												</span>
											)}
											<span className={styles.rowTotal}>{stat.total}</span>
										</List.Item>
									)
								})}
							</>
						))}
				</List.Root>
			</Card.Root>
		)
	},
	provideLinks: ({ url, name }) => [
		{
			type: 'Services',
			label: name,
			url,
			icon: TRAEFIK_ICON_URL,
		},
	],
})
