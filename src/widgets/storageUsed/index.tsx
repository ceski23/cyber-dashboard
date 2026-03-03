import { queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { HardDriveIcon } from 'lucide-react'
import prettyBytes from 'pretty-bytes'
import si from 'systeminformation'
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
		const data = (await si.fsSize(drive)).find(d => d.mount === drive || d.fs === drive)

		if (!data) {
			throw new Error(`Drive ${drive} not found`)
		}

		return {
			usage: data.used,
			size: data.size,
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
		const usageFraction = storageQuery.data ? storageQuery.data.usage / storageQuery.data.size : 0
		const usagePercent = String(Math.round(usageFraction * 100))
		const totalSize = storageQuery.data?.size ?? 0

		const statusConfig = (() => {
			if (usageFraction >= 0.9) return { status: 'danger' as const }
			if (usageFraction >= 0.7) return { status: 'warning' as const }
			return { status: 'normal' as const }
		})()

		return (
			<div
				className={styles.root({ status: statusConfig.status })}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div className={styles.content}>
					<div className={styles.header}>
						<div className={styles.iconRow}>
							<div className={styles.iconBadge}>
								<HardDriveIcon size={16} />
							</div>
							<span className={styles.label}>{drive}</span>
						</div>
						<span
							className={styles.meta}
							style={{ visibility: totalSize > 0 ? 'visible' : 'hidden' }}
						>
							{prettyBytes(totalSize)} total
						</span>
					</div>
					<div className={styles.bottom}>
						{match(storageQuery)
							.with({ status: 'pending' }, () => null)
							.with({ status: 'error' }, ({ error }) => (
								<span className={styles.meta}>{error.message}</span>
							))
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
				</div>
			</div>
		)
	},
})
