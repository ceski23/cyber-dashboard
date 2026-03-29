import {
	CircleQuestionMarkIcon,
	Cloud,
	CloudDrizzle,
	CloudFog,
	CloudLightning,
	CloudRain,
	CloudSnow,
	CloudSun,
	Snowflake,
	Sun,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { P, match } from 'ts-pattern'

export const getWMO = (code?: number): { label: string; icon: LucideIcon } =>
	match(code)
		.with(0, () => ({ label: 'Clear sky', icon: Sun }))
		.with(1, () => ({ label: 'Mainly clear', icon: Sun }))
		.with(2, () => ({ label: 'Partly cloudy', icon: CloudSun }))
		.with(3, () => ({ label: 'Overcast', icon: Cloud }))
		.with(P.union(45, 48), () => ({ label: 'Foggy', icon: CloudFog }))
		.with(P.union(51, 53, 55), () => ({ label: 'Drizzle', icon: CloudDrizzle }))
		.with(P.union(56, 57), () => ({ label: 'Freezing drizzle', icon: CloudDrizzle }))
		.with(P.union(61, 63, 65), () => ({ label: 'Rain', icon: CloudRain }))
		.with(P.union(66, 67), () => ({ label: 'Freezing rain', icon: CloudRain }))
		.with(P.union(71, 73, 75), () => ({ label: 'Snow', icon: CloudSnow }))
		.with(P.union(80, 81, 82), () => ({ label: 'Rain showers', icon: CloudRain }))
		.with(P.union(85, 86), () => ({ label: 'Snow showers', icon: CloudSnow }))
		.with(77, () => ({ label: 'Snow grains', icon: Snowflake }))
		.with(95, () => ({ label: 'Thunderstorm', icon: CloudLightning }))
		.with(P.union(96, 99), () => ({ label: 'Thunderstorm w/ hail', icon: CloudLightning }))
		.otherwise(() => ({ label: 'Unknown', icon: CircleQuestionMarkIcon }))
