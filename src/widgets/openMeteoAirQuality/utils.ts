import { vars } from '#theme.css'

export type AqiTier = typeof vars.color.aqi extends Record<infer Tier, string> ? Tier : never

export const getAqiInfo = (aqi?: number): { label: string; tier: AqiTier } => {
	if (aqi === undefined) return { label: 'Unknown', tier: 'unknown' }
	if (aqi <= 20) return { label: 'Good', tier: 'good' }
	if (aqi <= 40) return { label: 'Fair', tier: 'fair' }
	if (aqi <= 60) return { label: 'Moderate', tier: 'moderate' }
	if (aqi <= 80) return { label: 'Poor', tier: 'poor' }
	if (aqi <= 100) return { label: 'Very Poor', tier: 'veryPoor' }
	return { label: 'Extremely Poor', tier: 'extremelyPoor' }
}
