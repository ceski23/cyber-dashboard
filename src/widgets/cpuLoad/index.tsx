import { createTypedChart } from '#components/charts'
import { experimental_streamedQuery, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { CpuIcon } from 'lucide-react'
import { CircularBuffer } from 'mnemonist'
import si from 'systeminformation'
import z from 'zod'

import { defineWidget } from '../helpers'

import { cpuLoadOptions } from './schema'
import { loadVar, styles } from './style.css'

export type CpuData = {
	usage: number
	speed: number
	timestamp: number
}

export const streamCpuData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			interval: z.number().min(1000).default(5000),
		}),
	)
	.handler(async function* ({ data: { interval } }) {
		const { signal } = getRequest()
		const cache = new CircularBuffer<CpuData>(Array, 20)

		await si.currentLoad() // Warm up
		await Bun.sleep(1000)

		while (!signal.aborted) {
			const [{ currentLoad }, { avg: speed }] = await Promise.all([si.currentLoad(), si.cpuCurrentSpeed()])

			cache.push({
				usage: Math.min(currentLoad, 1),
				speed,
				timestamp: Date.now(),
			})

			yield Array.from(cache)

			await Bun.sleep(interval)
		}
	})

const PRIMARY_COLOR = '#3b82f6'
const TypedChart = createTypedChart<CpuData>()

const initialCpuData: CpuData = {
	usage: 1,
	speed: 0,
	timestamp: Date.now(),
}

export const cpuLoad = defineWidget({
	type: 'cpu-load',
	optionsSchema: cpuLoadOptions,
	Component: ({ options: { refreshInterval, showGraph }, columns }) => {
		const { data } = useQuery({
			queryKey: ['cpuData', { refreshInterval }] as const,
			queryFn: experimental_streamedQuery({
				initialValue: [initialCpuData],
				reducer: (_, chunk: CpuData[]) => chunk.filter(Boolean),
				streamFn: ({ signal }) => streamCpuData({ signal, data: { interval: refreshInterval } }),
			}),
			initialData: [initialCpuData],
			select: data => [initialCpuData, ...data],
		})
		const currentLoad = data?.at(-1)?.usage ?? 0
		const currentLoadPercent = currentLoad
			.toLocaleString(undefined, { maximumFractionDigits: 0, style: 'percent' })
			.slice(0, -1)
		const currentSpeed = data?.at(-1)?.speed ?? 0

		return (
			<div
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				{showGraph && (
					<div className={styles.chartOverlay}>
						<TypedChart.AreaChart
							width={0}
							height={0}
							style={{ width: '100%', height: '100%' }}
							responsive
							margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
							data={data?.map(item => ({
								usage: item.usage * 100,
								speed: item.speed,
								timestamp: item.timestamp,
							}))}
						>
							<defs>
								<linearGradient
									id="colorCpu"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={PRIMARY_COLOR}
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor={PRIMARY_COLOR}
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<TypedChart.Area
								type="monotone"
								dataKey="usage"
								stroke={PRIMARY_COLOR}
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#colorCpu)"
								isAnimationActive
							/>
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
								<CpuIcon size={16} />
							</div>
							<span className={styles.label}>CPU Load</span>
						</div>
						<span
							className={styles.meta}
							style={{ visibility: currentSpeed > 0 ? 'visible' : 'hidden' }}
						>
							{currentSpeed.toLocaleString(undefined, { maximumFractionDigits: 2 })} GHz
						</span>
					</div>
					<span
						className={styles.value}
						style={assignInlineVars({ [loadVar]: currentLoadPercent })}
					/>
				</div>
			</div>
		)
	},
})
