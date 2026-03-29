import { differenceInSeconds } from 'date-fns'
import { isNotNil } from 'es-toolkit'
import { ms } from 'ms'
import { useEffect, useState } from 'react'

export const useAutoEnableCountdown = (autoEnableAt: Date | undefined): number | null => {
	const getRemainingSeconds = () => (autoEnableAt ? differenceInSeconds(autoEnableAt, new Date()) : null)
	const [remainingSec, setRemainingSec] = useState(getRemainingSeconds)

	useEffect(() => {
		if (!autoEnableAt) {
			setRemainingSec(null)
			return
		}

		setRemainingSec(getRemainingSeconds())

		const tick = () => {
			const seconds = getRemainingSeconds()
			setRemainingSec(seconds)
			if (isNotNil(seconds) && seconds <= 0) clearInterval(intervalId)
		}

		const remaining = (getRemainingSeconds() ?? 0) * 1000
		const intervalId = setInterval(tick, remaining > ms('10m') ? ms('1m') : ms('1s'))

		return () => clearInterval(intervalId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoEnableAt])

	return remainingSec
}

export const formatAutoEnable = (seconds: number): string => {
	if (seconds >= 3600) {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
	}
	if (seconds >= 60) {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
	}
	return `${seconds}s`
}

export const formatQueriesCount = (num: number): string => {
	if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
	if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
	return num.toLocaleString()
}

export const formatResponseTime = (ms: number | null): string => {
	if (ms == null) return 'N/A'
	if (ms < 1) return '<1 ms'
	if (ms < 1000) return `${ms.toFixed(2)} ms`
	return `${(ms / 1000).toFixed(1)} s`
}

export const parseQueryTotals = (body: string) => {
	let totalQueries = 0
	let blockedQueries = 0
	let secSum = 0
	let secCount = 0

	for (const line of body.split('\n')) {
		const valueMatch = line.match(/\}\s+(\S+)$/)
		if (valueMatch == null) continue

		const value = Number.parseFloat(valueMatch[1])
		if (Number.isNaN(value)) continue

		if (line.startsWith('blocky_query_total')) {
			totalQueries += value
			if (line.includes('response_type="BLOCKED"')) blockedQueries += value
		} else if (line.startsWith('blocky_request_duration_seconds_sum{')) {
			secSum += value
		} else if (line.startsWith('blocky_request_duration_seconds_count{')) {
			secCount += value
		}
	}

	return {
		totalQueries,
		blockedQueries,
		avgResponseMs: secCount > 0 ? (secSum / secCount) * 1000 : null,
	}
}
