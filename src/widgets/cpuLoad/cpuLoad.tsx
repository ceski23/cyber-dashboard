import { experimental_streamedQuery, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { format, fromUnixTime } from 'date-fns'
import { CircularBuffer } from 'mnemonist'
import { Tooltip } from 'recharts'
import si from 'systeminformation'
import z from 'zod'

import { createTypedChart } from '@/components/charts'

import { defineWidget } from '../helpers'

import style from './cpuLoad.module.css'

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
	.handler(async function* ({ data: { interval }, signal }) {
		const cache = new CircularBuffer<CpuData>(Array, 20)

		await si.currentLoad() // Warm up
		await Bun.sleep(1000)

		while (true) {
			if (signal.aborted) {
				break
			}

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
	optionsSchema: z.strictObject({
		refreshInterval: z.number().min(1000).default(5000).describe('Interval (in ms) to refresh CPU data.'),
		showGraph: z.boolean().optional().default(true).describe('Whether to display the CPU usage graph.'),
	}),
	Component: ({ options: { refreshInterval, showGraph } }) => {
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
			<div>
				<p>
					CPU load:{' '}
					<span
						className={style.load}
						style={{ '--load': currentLoadPercent }}
					/>
				</p>
				{showGraph && (
					<TypedChart.LineChart
						style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
						responsive
						data={data?.map(item => ({
							usage: item.usage * 100,
							timestamp: item.timestamp,
						}))}
					>
						<TypedChart.Line
							dataKey="usage"
							type="monotone"
						/>
						<TypedChart.YAxis
							type="number"
							domain={[0, 100]}
							unit="%"
						/>
						<TypedChart.XAxis
							dataKey="timestamp"
							type="number"
							tickFormatter={tick => format(fromUnixTime(tick / 1000), 'HH:mm:ss')}
							domain={['dataMin', 'dataMax']}
						/>
						<Tooltip />
					</TypedChart.LineChart>
				)}
			</div>
		)
	},
})
