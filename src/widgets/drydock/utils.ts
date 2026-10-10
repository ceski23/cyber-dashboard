import { match, P } from 'ts-pattern'
import { z } from 'zod'

export const drydockContainerSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string().optional(),
	watcher: z.string().optional(),
	agent: z.string().optional(),
	updateAvailable: z.boolean().nullish(),
	updateKind: z
		.object({
			kind: z.string(),
			semverDiff: z.string().optional(),
			remoteValue: z.string().nullish(),
		})
		.nullish(),
	result: z.object({ tag: z.string().optional(), link: z.string().optional() }).nullish(),
	error: z.object({ message: z.string() }).nullish(),
})

// Older Drydock releases return a bare array; current releases wrap it in data.
export const drydockResponseSchema = z.union([
	z.array(drydockContainerSchema),
	z.object({ data: z.array(drydockContainerSchema) }).transform(response => response.data),
])

export type DrydockContainer = z.infer<typeof drydockContainerSchema>

export const getRowStatus = (container: DrydockContainer): 'upToDate' | 'update' | 'unknown' | 'error' => {
	if (container.error != null) return 'error'
	if (container.updateAvailable == null || container.updateKind?.kind === 'unknown') return 'unknown'
	return container.updateAvailable ? 'update' : 'upToDate'
}

export const getUpdateType = (container: DrydockContainer) => {
	if (container.updateAvailable !== true) return null

	return match(container.updateKind)
		.with({ kind: 'digest' }, () => 'digest' as const)
		.with({ kind: 'tag', semverDiff: P.union('major', 'minor', 'patch') }, ({ semverDiff }) => semverDiff)
		.otherwise(() => 'other' as const)
}

const getSeverity = (container: DrydockContainer) => {
	if (container.error != null) return 0

	return match(getUpdateType(container))
		.with('major', () => 1)
		.with('minor', () => 2)
		.with('patch', () => 3)
		.with('digest', () => 4)
		.with('other', () => 5)
		.with(null, () => (getRowStatus(container) === 'unknown' ? 6 : 7))
		.exhaustive()
}

export const sortBySeverity = (containers: DrydockContainer[]) =>
	[...containers].sort((left, right) => {
		const severity = getSeverity(left) - getSeverity(right)
		if (severity !== 0) return severity

		const leftName = (left.displayName ?? '').trim() || left.name
		const rightName = (right.displayName ?? '').trim() || right.name
		return leftName.localeCompare(rightName)
	})

export const getMetrics = (containers: DrydockContainer[]) => ({
	monitored: containers.length,
	upToDate: containers.filter(container => getRowStatus(container) === 'upToDate').length,
	updates: containers.filter(container => container.updateAvailable === true).length,
	unknown: containers.filter(container => ['unknown', 'error'].includes(getRowStatus(container))).length,
})
