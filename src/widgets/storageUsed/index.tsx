import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import prettyBytes from 'pretty-bytes'
import si from 'systeminformation'
import { match } from 'ts-pattern'
import z from 'zod'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { defineWidget } from '../helpers'

import { storageUsedOptions } from './schema'

export type StorageData = {
	usage: number
	size: number
}

export const fetchStorageData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			drive: z.string(),
		}),
	)
	.handler(async ({ data: { drive } }) => {
		const data = (await si.fsSize(drive)).find(d => d.mount === drive || d.fs === drive)

		if (!data) {
			throw new Error(`Drive ${drive} not found`)
		}

		return {
			usage: data.used,
			size: data.size,
		}
	})

export const storageUsed = defineWidget({
	type: 'storage-used',
	optionsSchema: storageUsedOptions,
	Component: ({ options: { drive }, columns }) => {
		const storageQuery = useQuery({
			queryKey: ['storageData', { drive }] as const,
			queryFn: () => fetchStorageData({ data: { drive } }),
		})

		return (
			<Card style={{ gridColumn: `span ${columns ?? 1}` }}>
				<CardHeader>
					<h2 className="text-lg font-semibold">Storage Usage</h2>
				</CardHeader>
				<CardContent>
					{match(storageQuery)
						.with({ status: 'pending' }, () => <div>Loading...</div>)
						.with({ status: 'error' }, ({ error }) => <div>Error: {error.message}</div>)
						.with({ status: 'success' }, ({ data }) => (
							<div className="space-y-2">
								<h3>Storage Usage for {drive}</h3>
								<p>
									Usage: {prettyBytes(data.usage)} / {prettyBytes(data.size)}
								</p>
							</div>
						))
						.otherwise(() => null)}
				</CardContent>
			</Card>
		)
	},
})
