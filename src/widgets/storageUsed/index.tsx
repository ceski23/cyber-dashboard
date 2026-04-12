import { Card } from '#components/card'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { HardDriveIcon } from 'lucide-react'
import { OSUtils } from 'node-os-utils'
import prettyBytes from 'pretty-bytes'
import { match } from 'ts-pattern'
import z from 'zod'
import { defineWidget } from '../helpers'
import { storageUsedOptions } from './schema'
import { storageVar, styles } from './style.css'

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
		const osutils = new OSUtils()
		const diskUsage = await osutils.disk.usageByMountPoint(drive)

		if (!diskUsage.success) {
			throw new Error(`Failed to fetch storage data for drive ${drive}: ${diskUsage.error.message}`, {
				cause: diskUsage.error,
			})
		}

		if (diskUsage.data === null) {
			throw new Error(`No storage data available for drive ${drive}`)
		}

		return {
			usage: diskUsage.data.used.bytes,
			size: diskUsage.data.total.bytes,
		}
	})

export const storageDataQuery = (drive: string) =>
	queryOptions({
		queryKey: ['storageData', { drive }] as const,
		queryFn: () => fetchStorageData({ data: { drive } }),
	})

export const storageUsed = defineWidget({
	type: 'storage-used',
	optionsSchema: storageUsedOptions,
	loader: async (queryClient, { drive }) => {
		await queryClient.prefetchQuery(storageDataQuery(drive))
	},
	Component: ({ options: { drive }, columns }) => {
		const storageQuery = useQuery(storageDataQuery(drive))
		const usage = storageQuery.data?.usage ?? 0
		const usageFraction = storageQuery.data ? storageQuery.data.usage / storageQuery.data.size : 0
		const usagePercent = String(Math.round(usageFraction * 100))
		const totalSize = storageQuery.data?.size ?? 0

		const statusConfig = (() => {
			if (usageFraction >= 0.9) return { status: 'danger' as const }
			if (usageFraction >= 0.7) return { status: 'warning' as const }
			return { status: 'normal' as const }
		})()

		if (storageQuery.isError) {
			throw new Error(`Failed to fetch storage data: ${storageQuery.error.message}`)
		}

		return (
			<Card.Root
				className={styles.root}
				tone={statusConfig.status === 'normal' ? 'default' : statusConfig.status}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<Card.Content
					className={styles.content}
					padding="lg"
				>
					<Card.Header
						icon={<HardDriveIcon size={16} />}
						label={drive}
					>
						<span
							className={styles.meta}
							style={{ visibility: totalSize > 0 ? 'visible' : 'hidden' }}
						>
							{prettyBytes(usage, { binary: true })} / {prettyBytes(totalSize, { binary: true })}
						</span>
					</Card.Header>
					<div className={styles.bottom}>
						{match(storageQuery)
							.with({ status: 'pending' }, () => null)
							.otherwise(() => (
								<>
									<span
										className={styles.value}
										style={assignInlineVars({ [storageVar]: usagePercent })}
									/>
									<div className={styles.progressTrack}>
										<div
											className={styles.progressBar}
											style={{ width: `${usagePercent}%` }}
										/>
									</div>
								</>
							))}
					</div>
				</Card.Content>
			</Card.Root>
		)
	},
})
