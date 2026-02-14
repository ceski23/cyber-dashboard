import { skipToken, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { isNil } from 'es-toolkit'
import { fetchWeatherApi } from 'openmeteo'
import z from 'zod'

import { configMiddleware } from '@/lib/config/middleware'
import { locationQuery } from '@/services/location'

import { defineWidget } from '../helpers'

import { openMeteoWeatherOptions } from './schema'

const getWMOLabel = (code: number): string => {
	switch (code) {
		case 0:
			return 'Clear sky'
		case 1:
		case 2:
		case 3:
			return 'Mainly clear, partly cloudy, and overcast'
		case 45:
		case 48:
			return 'Fog and depositing rime fog'
		case 51:
		case 53:
		case 55:
			return 'Drizzle: Light, moderate, and dense intensity'
		case 56:
		case 57:
			return 'Freezing Drizzle: Light and dense intensity'
		case 61:
		case 63:
		case 65:
			return 'Rain: Slight, moderate and heavy intensity'
		case 66:
		case 67:
			return 'Freezing Rain: Light and heavy intensity'
		case 71:
		case 73:
		case 75:
			return 'Snow fall: Slight, moderate, and heavy intensity'
		case 77:
			return 'Snow grains'
		case 80:
		case 81:
		case 82:
			return 'Rain showers: Slight, moderate, and violent'
		case 85:
		case 86:
			return 'Snow showers slight and heavy'
		case 95:
			return 'Thunderstorm: Slight or moderate'
		case 96:
		case 99:
			return 'Thunderstorm with slight and heavy hail'
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

export const openMeteoWeather = defineWidget({
	type: 'open-meteo-weather',
	optionsSchema: openMeteoWeatherOptions,
	Component: ({ options: { location }, columns }) => {
		const { data: locationData, error: locationError } = useQuery(locationQuery(location))
		const { data, error: weatherError } = useQuery({
			queryKey: ['openMeteo', 'currentWeather', locationData],
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
				<div>Open Meteo Widget</div>
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</div>
		)
	},
})
