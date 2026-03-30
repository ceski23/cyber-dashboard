import type { CupImage } from './data'

export const UPDATE_BADGE_LABELS: Record<'major' | 'minor' | 'patch' | 'digest' | 'other', string> = {
	major: 'Major',
	minor: 'Minor',
	patch: 'Patch',
	digest: 'Digest',
	other: 'Other',
}

export const getUpdateType = (image: CupImage): 'major' | 'minor' | 'patch' | 'digest' | 'other' | null => {
	if (image.result.has_update !== true) return null

	const info = image.result.info

	if (info == null) return null
	if (info.type === 'version') return info.version_update_type ?? 'other'

	return 'digest'
}

export const getRowStatus = (image: CupImage): 'upToDate' | 'update' | 'unknown' | 'error' => {
	if (image.result.error != null) return 'error'
	if (image.result.has_update == null) return 'unknown'
	if (image.result.has_update) return 'update'
	return 'upToDate'
}
