import { experimental_streamedQuery, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { format, fromUnixTime } from 'date-fns'
import { CircularBuffer } from 'mnemonist'
import { Tooltip } from 'recharts'
import si from 'systeminformation'
import z from 'zod'

import { createTypedChart } from '@/components/charts'

import { defineWidget } from '../helpers'

import style from './memoryUsed.module.css'

export type MemoryData = {
	used: number
	total: number
	timestamp: number
}

export const streamMemoryData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			interval: z.number().min(1000).default(5000),
		}),
	)
	.handler(async function* ({ data: { interval }, signal }) {
		const cache = new CircularBuffer<MemoryData>(Array, 20)

		while (!signal.aborted) {
			const { used, total } = await si.mem()

			cache.push({
				used: used,
				total: total,
				timestamp: Date.now(),
			})

			yield Array.from(cache)

			await Bun.sleep(interval)
		}
	})

const TypedChart = createTypedChart<{
	usage: number
	timestamp: number
}>()

export const memoryUsed = defineWidget({
	type: 'memory-used',
	optionsSchema: z.strictObject({
		refreshInterval: z.number().min(1000).default(5000).describe('Interval (in ms) to refresh memory data.'),
		showGraph: z.boolean().optional().default(true).describe('Whether to display the memory usage graph.'),
	}),
	Component: ({ options: { refreshInterval, showGraph }, columns }) => {
		const { data } = useQuery({
			queryKey: ['memoryData', { refreshInterval }] as const,
			queryFn: experimental_streamedQuery({
				initialValue: new Array<MemoryData>(),
				reducer: (_, chunk: MemoryData[]) => chunk.filter(Boolean),
				streamFn: ({ signal }) => streamMemoryData({ signal, data: { interval: refreshInterval } }),
			}),
		})
		const currentUsed = data?.at(-1)?.used ?? 0
		const currentTotal = data?.at(-1)?.total ?? 0
		const currentUsagePercent = (currentUsed / currentTotal)
			.toLocaleString(undefined, { maximumFractionDigits: 0, style: 'percent' })
			.slice(0, -1)

		return (
			<div style={{ gridColumn: `span ${columns ?? 1}` }}>
				<p>
					Memory usage:{' '}
					<span
						className={style.memory}
						style={{ '--memory': currentUsagePercent }}
					/>
					(
					{currentUsed.toLocaleString(undefined, {
						notation: 'compact',
						unit: 'byte',
						style: 'unit',
					})}{' '}
					/{' '}
					{currentTotal.toLocaleString(undefined, {
						notation: 'compact',
						unit: 'byte',
						style: 'unit',
					})}
					)
				</p>
				{showGraph && (
					<TypedChart.LineChart
						style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
						responsive
						data={data?.map(item => ({
							usage: (item.used / item.total) * 100,
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
