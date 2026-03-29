export const formatUptime = (seconds: number): string => {
	const days = Math.floor(seconds / 86400)
	const hours = Math.floor((seconds % 86400) / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	if (days > 0) return `${days}d ${hours}h`
	if (hours > 0) return `${hours}h ${minutes}m`
	return `${minutes}m`
}

export const formatBytes = (bytes: number): string => {
	const gb = bytes / 1024 / 1024 / 1024
	if (gb >= 1) return `${gb.toFixed(1)} GB`
	return `${(bytes / 1024 / 1024).toFixed(0)} MB`
}
