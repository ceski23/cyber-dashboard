import { experimental_streamedQuery, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { format, fromUnixTime } from 'date-fns'
import { CircularBuffer } from 'mnemonist'
import { CartesianGrid, Tooltip } from 'recharts'
import si from 'systeminformation'
import z from 'zod'

import { createTypedChart } from '@/components/charts'

import { defineWidget } from '../helpers'

import style from './cpuLoad.module.css'
import { cpuLoadOptions } from './schema'

export type CpuData = {
	usage: number
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
			const { currentLoad } = await si.currentLoad()

			cache.push({
				usage: Math.min(currentLoad, 1),
				timestamp: Date.now(),
			})

			yield Array.from(cache)

			await Bun.sleep(interval)
		}
	})

const TypedChart = createTypedChart<CpuData>()

export const cpuLoad = defineWidget({
	type: 'cpu-load',
	optionsSchema: cpuLoadOptions,
	Component: ({ options: { refreshInterval, showGraph }, columns }) => {
		const { data } = useQuery({
			queryKey: ['cpuData', { refreshInterval }] as const,
			queryFn: experimental_streamedQuery({
				initialValue: new Array<CpuData>(),
				reducer: (_, chunk: CpuData[]) => chunk.filter(Boolean),
				streamFn: ({ signal }) => streamCpuData({ signal, data: { interval: refreshInterval } }),
			}),
		})
		const currentLoad = data?.at(-1)?.usage ?? 0
		const currentLoadPercent = currentLoad
			.toLocaleString(undefined, { maximumFractionDigits: 0, style: 'percent' })
			.slice(0, -1)

		return (
			<div style={{ gridColumn: `span ${columns ?? 1}` }}>
				<p>
					CPU load:{' '}
					<span
						className={style.load}
						style={{ '--load': currentLoadPercent }}
					/>
				</p>
				{showGraph && (
					<TypedChart.AreaChart
						style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
						responsive
						data={data?.map(item => ({
							usage: item.usage * 100,
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
									stopColor="#3b82f6"
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor="#3b82f6"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#27272a"
							vertical={false}
						/>
						<TypedChart.Area
							type="monotone"
							dataKey="usage"
							stroke="#3b82f6"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorCpu)"
						/>
						<TypedChart.YAxis
							type="number"
							domain={[0, 100]}
							unit="%"
							tickLine={false}
							axisLine={false}
						/>
						<TypedChart.XAxis
							dataKey="timestamp"
							type="number"
							tickFormatter={tick => format(fromUnixTime(tick / 1000), 'HH:mm:ss')}
							domain={['dataMin', 'dataMax']}
							stroke="#52525b"
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip />
					</TypedChart.AreaChart>
				)}
			</div>
		)
	},
})
