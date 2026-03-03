import { locationQuery } from '#services/location'
import { vars } from '#theme.css'
import { queryOptions, skipToken, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { format } from 'date-fns'
import { isNil } from 'es-toolkit'
import { fetchWeatherApi } from 'openmeteo'
import z from 'zod'
import { defineWidget } from '../helpers'
import { openMeteoAirQualityOptions } from './schema'
import { styles } from './style.css'

const fetchCurrentWeather = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			latitude: z.number().min(-90).max(90),
			longitude: z.number().min(-180).max(180),
		}),
	)
	.handler(
		async ({
			data: { latitude, longitude },
			// context: {
			// 	config: { units },
			// },
		}) => {
			const { signal } = getRequest()
			const units = 'metric' // TODO: get from config
			const response = await fetchWeatherApi(
				'https://air-quality-api.open-meteo.com/v1/air-quality',
				{
					latitude,
					longitude,
					current: ['pm10', 'pm2_5', 'european_aqi', 'carbon_monoxide'],
					temperature_unit: units === 'metric' ? 'celsius' : 'fahrenheit',
					wind_speed_unit: units === 'metric' ? 'kmh' : 'mph',
					precipitation_unit: units === 'metric' ? 'mm' : 'inch',
					domains: 'cams_europe',
				},
				undefined,
				undefined,
				undefined,
				{ signal },
			).then(responses => {
				const response = responses.at(0)
				const current = response?.current()
				const utcOffsetSeconds = response?.utcOffsetSeconds()

				return !current || isNil(utcOffsetSeconds) ? undefined : { current, utcOffsetSeconds }
			})

			if (!response) {
				throw new Error('No response from Open Meteo API')
			}

			return {
				time: new Date((Number(response.current.time()) + response.utcOffsetSeconds) * 1000),
				pm10: response.current.variables(0)!.value(),
				pm25: response.current.variables(1)!.value(),
				europeanAqi: response.current.variables(2)!.value(),
				carbonMonoxide: response.current.variables(3)!.value(),
			}
		},
	)

type AqiTier = typeof vars.color.aqi extends Record<infer Tier, string> ? Tier : never

const getAqiInfo = (aqi?: number): { label: string; tier: AqiTier } => {
	if (aqi === undefined) return { label: 'Unknown', tier: 'unknown' }
	if (aqi <= 20) return { label: 'Good', tier: 'good' }
	if (aqi <= 40) return { label: 'Fair', tier: 'fair' }
	if (aqi <= 60) return { label: 'Moderate', tier: 'moderate' }
	if (aqi <= 80) return { label: 'Poor', tier: 'poor' }
	if (aqi <= 100) return { label: 'Very Poor', tier: 'veryPoor' }
	return { label: 'Extremely Poor', tier: 'extremelyPoor' }
}

const airQualityDataQuery = (locationData?: { latitude: number; longitude: number }) =>
	queryOptions({
		queryKey: ['openMeteo', 'airQuality', locationData],
		queryFn: isNil(locationData)
			? skipToken
			: async ({ signal }) => fetchCurrentWeather({ data: locationData, signal }),
	})

export const openMeteoAirQuality = defineWidget({
	type: 'open-meteo-air-quality',
	optionsSchema: openMeteoAirQualityOptions,
	loader: async (queryClient, { location }) => {
		if (location === 'auto' && typeof window === 'undefined') return

		const locationData = await queryClient.ensureQueryData(locationQuery(location))
		await queryClient.prefetchQuery(airQualityDataQuery(locationData))
	},
	Component: ({ options: { location }, columns }) => {
		const { data: locationData, error: locationError } = useQuery(locationQuery(location))
		const { data, error: weatherError } = useQuery(airQualityDataQuery(locationData))

		if (locationError) {
			throw new Error(`Failed to determine location: ${locationError.message}`)
		}

		if (weatherError) {
			throw new Error(`Failed to fetch weather data: ${weatherError.message}`)
		}

		const aqiInfo = getAqiInfo(data?.europeanAqi)

		return (
			<div
				className={styles.root({ tier: aqiInfo.tier })}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div className={styles.glow({ tier: aqiInfo.tier })} />

				<div className={styles.content}>
					<div className={styles.topRow}>
						<span className={styles.widgetLabel}>Air Quality</span>
						{data?.time && <span className={styles.timestamp}>Updated {format(data.time, 'HH:mm')}</span>}
					</div>

					<div className={styles.heroRow}>
						<div className={styles.aqiBlock}>
							<span className={styles.aqiScore({ tier: aqiInfo.tier })}>
								{isNil(data?.europeanAqi) ? '—' : Math.round(data.europeanAqi)}
							</span>
							<span className={styles.aqiLabel}>{aqiInfo.label}</span>
						</div>
						{/* <div className={styles.pm25Chip}>
							<span className={styles.pm25ChipLabel}>PM 2.5</span>
							<span className={styles.pm25ChipValue}>
								{isNil(data) ? '—' : data.pm25.toFixed(1)}
								<span className={styles.pm25ChipUnit}> µg/m³</span>
							</span>
						</div> */}
					</div>

					<div className={styles.divider} />

					<div className={styles.statsRow}>
						<div className={styles.statItem}>
							<span className={styles.statValue}>
								{isNil(data) ? '—' : `${data.pm25.toFixed(1)} µg/m³`}
							</span>
							<span className={styles.statLabel}>PM 2.5</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statValue}>
								{isNil(data) ? '—' : `${data.pm10.toFixed(1)} µg/m³`}
							</span>
							<span className={styles.statLabel}>PM 10</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statValue}>
								{isNil(data) ? '—' : `${data.carbonMonoxide.toFixed(1)} µg/m³`}
							</span>
							<span className={styles.statLabel}>CO</span>
						</div>
					</div>
				</div>
			</div>
		)
	},
})
