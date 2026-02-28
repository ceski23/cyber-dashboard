import { configMiddleware } from '#lib/config/middleware'
import { locationQuery } from '#services/location'
import { skipToken, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { format } from 'date-fns'
import { isNil } from 'es-toolkit'
import { fetchWeatherApi } from 'openmeteo'
import z from 'zod'

import { defineWidget } from '../helpers'

import { openMeteoWeatherOptions } from './schema'
import { styles } from './style.css'

const getWMOLabel = (code: number): string => {
	switch (code) {
		case 0:
			return 'Clear sky'
		case 1:
			return 'Mainly clear'
		case 2:
			return 'Partly cloudy'
		case 3:
			return 'Overcast'
		case 45:
		case 48:
			return 'Foggy'
		case 51:
		case 53:
		case 55:
			return 'Drizzle'
		case 56:
		case 57:
			return 'Freezing drizzle'
		case 61:
		case 63:
		case 65:
			return 'Rain'
		case 66:
		case 67:
			return 'Freezing rain'
		case 71:
		case 73:
		case 75:
			return 'Snow'
		case 77:
			return 'Snow grains'
		case 80:
		case 81:
		case 82:
			return 'Rain showers'
		case 85:
		case 86:
			return 'Snow showers'
		case 95:
			return 'Thunderstorm'
		case 96:
		case 99:
			return 'Thunderstorm w/ hail'
		default:
			return 'Unknown'
	}
}

const fetchCurrentWeather = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
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
				'https://api.open-meteo.com/v1/forecast',
				{
					latitude,
					longitude,
					current: [
						'temperature_2m',
						'relative_humidity_2m',
						'apparent_temperature',
						'precipitation',
						'weather_code',
						'surface_pressure',
					],
					temperature_unit: units === 'metric' ? 'celsius' : 'fahrenheit',
					wind_speed_unit: units === 'metric' ? 'kmh' : 'mph',
					precipitation_unit: units === 'metric' ? 'mm' : 'inch',
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
				temperature: response.current.variables(0)!.value(),
				relativeHumidity: response.current.variables(1)!.value(),
				apparentTemperature: response.current.variables(2)!.value(),
				precipitation: response.current.variables(3)!.value(),
				weatherCode: response.current.variables(4)!.value(),
				weatherDescription: getWMOLabel(response.current.variables(4)!.value()),
				surfacePressure: response.current.variables(5)!.value(),
			}
		},
	)

const weatherDataQuery = (locationData?: { latitude: number; longitude: number }) =>
	queryOptions({
		queryKey: ['openMeteo', 'currentWeather', locationData],
		queryFn: isNil(locationData)
			? skipToken
			: async ({ signal }) => fetchCurrentWeather({ data: locationData, signal }),
	})

export const openMeteoWeather = defineWidget({
	type: 'open-meteo-weather',
	optionsSchema: openMeteoWeatherOptions,
	loader: async (queryClient, { location }) => {
		if (location === 'auto' && typeof window === 'undefined') return

		const locationData = await queryClient.ensureQueryData(locationQuery(location))
		await queryClient.prefetchQuery(weatherDataQuery(locationData))
	},
	Component: ({ options: { location }, columns }) => {
		const { data: locationData, error: locationError } = useQuery(locationQuery(location))
		const { data, error: weatherError } = useQuery(weatherDataQuery(locationData))

		if (locationError) {
			throw new Error(`Failed to determine location: ${locationError.message}`)
		}

		if (weatherError) {
			throw new Error(`Failed to fetch weather data: ${weatherError.message}`)
		}

		const tempUnit = '°C' // TODO: from config

		return (
			<div
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div className={styles.tempBlock}>
					<span className={styles.temperature}>
						{isNil(data) ? '—' : `${Math.round(data.temperature)}${tempUnit}`}
					</span>
					<span className={styles.condition}>{data?.weatherDescription ?? '—'}</span>
				</div>

				<div className={styles.infoBlock}>
					<div className={styles.topRow}>
						<span className={styles.header}>Weather</span>
						{data?.time && <span className={styles.timestamp}>Updated {format(data.time, 'HH:mm')}</span>}
					</div>

					<div className={styles.metricsRow}>
						<div className={styles.metricItem}>
							<span className={styles.metricLabel}>Feels like</span>
							<span className={styles.metricValue}>
								{isNil(data) ? '—' : `${Math.round(data.apparentTemperature)}${tempUnit}`}
							</span>
						</div>
						<div className={styles.metricItem}>
							<span className={styles.metricLabel}>Humidity</span>
							<span className={styles.metricValue}>
								{isNil(data) ? '—' : `${Math.round(data.relativeHumidity)} %`}
							</span>
						</div>
						<div className={styles.metricItem}>
							<span className={styles.metricLabel}>Precipitation</span>
							<span className={styles.metricValue}>
								{isNil(data) ? '—' : `${data.precipitation.toFixed(1)} mm`}
							</span>
						</div>
						<div className={styles.metricItem}>
							<span className={styles.metricLabel}>Pressure</span>
							<span className={styles.metricValue}>
								{isNil(data) ? '—' : `${Math.round(data.surfacePressure)} hPa`}
							</span>
						</div>
					</div>
				</div>
			</div>
		)
	},
})
