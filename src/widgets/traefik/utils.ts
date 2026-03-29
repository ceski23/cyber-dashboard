import type { TraefikStat } from './data'

export const getStatStatus = (stat: TraefikStat): 'ok' | 'warning' | 'error' => {
	if (stat.errors > 0) return 'error'
	if (stat.warnings > 0) return 'warning'
	return 'ok'
}

export const getOverallStatus = (stats: TraefikStat[]): 'success' | 'warning' | 'error' => {
	if (stats.some(stat => stat.errors > 0)) return 'error'
	if (stats.some(stat => stat.warnings > 0)) return 'warning'
	return 'success'
}
