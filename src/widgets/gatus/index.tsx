import { StyledTooltip } from '#components/tooltip'
import { experimental_streamedQuery, queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { groupBy } from 'es-toolkit'
import ky from 'ky'
import { Fragment } from 'react'
import { z } from 'zod'
import { defineWidget } from '../helpers'
import { gatusOptions } from './schema'
import { styles } from './style.css'

const GATUS_ICON_URL = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/gatus.svg'

const gatusEndpointSchema = z.object({
	name: z.string(),
	key: z.string(),
	group: z.string().optional(),
	results: z
		.array(
			z.object({
				duration: z.number(),
				success: z.boolean(),
			}),
		)
		.optional(),
})

const gatusResponseSchema = z.array(gatusEndpointSchema)

type GatusEndpoint = {
	key: string
	name: string
	group?: string
	status: 'available' | 'unavailable' | 'unknown'
	durationMs: number
	history: Array<{ success: boolean; durationMs: number }>
}

const streamGatusWidgetData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			baseUrl: z.string(),
			refreshInterval: z.number(),
		}),
	)
	.handler(async function* ({ data: { baseUrl, refreshInterval } }) {
		const { signal } = getRequest()
		const apiClient = ky.create({ prefixUrl: baseUrl })

		while (!signal.aborted) {
			const raw = await apiClient
				.get('api/v1/endpoints/statuses', { signal })
				.json()
				.then(data => gatusResponseSchema.parse(data))

			yield raw.map<GatusEndpoint>(endpoint => {
				const results = endpoint.results ?? []
				const lastResult = results.at(-1)
				const isSuccess = lastResult?.success

				return {
					key: endpoint.key,
					name: endpoint.name,
					group: endpoint.group,
					status: isSuccess === undefined ? 'unknown' : isSuccess ? 'available' : 'unavailable',
					durationMs: lastResult ? Math.round(lastResult.duration / 1_000_000) : 0,
					history: results.map(result => ({
						success: result.success,
						durationMs: Math.round(result.duration / 1_000_000),
					})),
				}
			})

			await Bun.sleep(refreshInterval)
		}
	})

const streamGatusWidgetQuery = (baseUrl: string, refreshInterval: number) =>
	queryOptions({
		queryKey: ['gatusWidgetData', { baseUrl, refreshInterval }] as const,
		queryFn: experimental_streamedQuery({
			initialValue: [] as GatusEndpoint[],
			reducer: (_, chunk: GatusEndpoint[]) => chunk,
			streamFn: ({ signal }) => streamGatusWidgetData({ data: { baseUrl, refreshInterval }, signal }),
		}),
	})

const formatDuration = (ms: number) => (ms < 1 ? '<1ms' : `${ms}ms`)

export const gatusWidget = defineWidget({
	type: 'gatus',
	optionsSchema: gatusOptions,
	Component: ({ options: { name, url, refreshInterval }, columns }) => {
		const { data: endpoints = [], error } = useQuery(streamGatusWidgetQuery(url, refreshInterval))

		if (error) throw new Error(`Failed to load Gatus data: ${error.message}`)

		const upCount = endpoints.filter(endpoint => endpoint.status === 'available').length
		const totalCount = endpoints.length
		const badgeStatus =
			totalCount === 0 ? 'warning' : upCount === totalCount ? 'success' : upCount === 0 ? 'error' : 'warning'
		const grouped = groupBy(endpoints, endpoint => endpoint.group ?? '')
		const hasGroups = Object.keys(grouped).some(group => group !== '')

		return (
			<div
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div className={styles.header}>
					<div className={styles.headerLeft}>
						<img
							src={GATUS_ICON_URL}
							alt="Gatus"
							className={styles.icon}
						/>
						<span className={styles.title}>{name}</span>
					</div>
					{totalCount > 0 && (
						<span className={styles.badge({ status: badgeStatus })}>
							{upCount} / {totalCount}
						</span>
					)}
				</div>

				<div className={styles.list}>
					{endpoints.length === 0 ? (
						<div className={styles.empty}>Loading…</div>
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
											<div className={styles.row}>
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
											</div>
										</StyledTooltip>
									)
								})}
							</Fragment>
						))
					)}
				</div>
			</div>
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
