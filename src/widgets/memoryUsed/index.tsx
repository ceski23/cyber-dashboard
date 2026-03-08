import { createTypedChart } from '#components/charts'
import { vars } from '#theme.css'
import { experimental_streamedQuery, queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { isNotNil } from 'es-toolkit'
import { MemoryStickIcon } from 'lucide-react'
import { CircularBuffer } from 'mnemonist'
import prettyBytes from 'pretty-bytes'
import si from 'systeminformation'
import z from 'zod'
import { defineWidget } from '../helpers'
import { memoryUsedOptions } from './schema'
import { memoryVar, styles } from './style.css'

export type MemoryData = {
	used: number
	total: number
	timestamp: number
}

const ITEMS_LIMIT = 10

export const streamMemoryData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			interval: z.number().min(1000).default(5000),
		}),
	)
	.handler(async function* ({ data: { interval } }) {
		const { signal } = getRequest()
		const cache = new CircularBuffer<MemoryData>(Array, ITEMS_LIMIT)

		while (!signal.aborted) {
			const { used, total } = await si.mem()

			cache.push({
				used,
				total,
				timestamp: Date.now(),
			})

			yield Array.from(cache)

			await Bun.sleep(interval)
		}
	})

const TypedChart = createTypedChart<{ usage: number; timestamp: number }>()

const initialMemoryData: MemoryData = { used: 0, total: 0, timestamp: Date.now() }

const streamMemoryDataQuery = (refreshInterval: number) =>
	queryOptions({
		queryKey: ['memoryData', { refreshInterval }] as const,
		queryFn: experimental_streamedQuery({
			initialValue: new Array<MemoryData>(),
			reducer: (_, chunk: MemoryData[]) => chunk.filter(Boolean),
			streamFn: ({ signal }) => streamMemoryData({ signal, data: { interval: refreshInterval } }),
		}),
		select: (data: MemoryData[]) => [initialMemoryData, ...data].slice(-ITEMS_LIMIT),
	})

export const memoryUsed = defineWidget({
	type: 'memory-used',
	optionsSchema: memoryUsedOptions,
	Component: ({ options: { refreshInterval, showGraph }, columns }) => {
		const { data, error } = useQuery(streamMemoryDataQuery(refreshInterval))
		const currentUsed = data?.at(-1)?.used ?? 0
		const currentTotal = data?.at(-1)?.total ?? 0
		const usageFraction = currentTotal === 0 ? 0 : currentUsed / currentTotal
		const usagePercent = String(Math.round(usageFraction * 100))
		const currentAvailable = currentTotal - currentUsed

		const statusConfig = (() => {
			if (usageFraction >= 0.9) return { status: 'danger' as const, color: vars.color.red[500] }
			if (usageFraction >= 0.7) return { status: 'warning' as const, color: vars.color.amber[500] }
			return { status: 'normal' as const, color: vars.color.neutral[500] }
		})()

		if (error) {
			throw new Error(`Failed to fetch memory data: ${error.message}`)
		}

		return (
			<div
				className={styles.root({ status: statusConfig.status })}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				{showGraph && (
					<div className={styles.chartOverlay}>
						<TypedChart.AreaChart
							width={0}
							height={0}
							style={{ width: '100%', height: '100%' }}
							responsive
							margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
							data={data?.map(item => ({
								usage: item.total === 0 ? 0 : (item.used / item.total) * 100,
								timestamp: item.timestamp,
							}))}
						>
							<defs>
								<linearGradient
									id="colorMemory"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={statusConfig.color}
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor={statusConfig.color}
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							{isNotNil(data) && data.length > 1 && (
								<TypedChart.Area
									type="monotone"
									dataKey="usage"
									stroke={statusConfig.color}
									strokeWidth={2}
									fillOpacity={1}
									fill="url(#colorMemory)"
									isAnimationActive
								/>
							)}
							<TypedChart.YAxis
								type="number"
								domain={[0, 100]}
								hide
							/>
						</TypedChart.AreaChart>
					</div>
				)}
				<div className={styles.content}>
					<div className={styles.header}>
						<div className={styles.iconRow}>
							<div className={styles.iconBadge}>
								<MemoryStickIcon size={16} />
							</div>
							<span className={styles.label}>Memory</span>
						</div>
						<span
							className={styles.meta}
							style={{ visibility: currentTotal > 0 ? 'visible' : 'hidden' }}
						>
							{prettyBytes(currentAvailable)} free
						</span>
					</div>
					<span
						className={styles.value}
						style={assignInlineVars({ [memoryVar]: usagePercent })}
					/>
				</div>
			</div>
		)
	},
})
