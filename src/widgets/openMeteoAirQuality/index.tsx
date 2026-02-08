import { skipToken, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { isNil } from 'es-toolkit'
import { fetchWeatherApi } from 'openmeteo'
import z from 'zod'

import { configMiddleware } from '@/lib/config/middleware'
import { locationQuery } from '@/services/location'

import { defineWidget } from '../helpers'

import { openMeteoAirQualityOptions } from './schema'

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
			const units = 'metric' // TODO: get from config
			const response = await fetchWeatherApi('https://air-quality-api.open-meteo.com/v1/air-quality', {
				latitude,
				longitude,
				current: ['pm10', 'pm2_5', 'european_aqi'],
				temperature_unit: units === 'metric' ? 'celsius' : 'fahrenheit',
				wind_speed_unit: units === 'metric' ? 'kmh' : 'mph',
				precipitation_unit: units === 'metric' ? 'mm' : 'inch',
			}).then(responses => {
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
			}
		},
	)

export const openMeteoAirQuality = defineWidget({
	type: 'open-meteo-air-quality',
	optionsSchema: openMeteoAirQualityOptions,
	Component: ({ options: { location }, columns }) => {
		const { data: locationData, error: locationError } = useQuery(locationQuery(location))
		const { data, error: weatherError } = useQuery({
			queryKey: ['openMeteo', 'airQuality', locationData],
			queryFn: isNil(locationData)
				? skipToken
				: async ({ signal }) => fetchCurrentWeather({ data: locationData, signal }),
		})

		if (locationError) {
			throw new Error(`Failed to determine location: ${locationError.message}`)
		}

		if (weatherError) {
			throw new Error(`Failed to fetch weather data: ${weatherError.message}`)
		}

		return (
			<div style={{ gridColumn: `span ${columns ?? 1}` }}>
				<div>Open Meteo Air Quality Widget</div>
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</div>
		)
	},
})
