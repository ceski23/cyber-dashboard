import { configMiddleware } from '#lib/config/middleware'
import { queryOptions, skipToken } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { isNil } from 'es-toolkit'
import { fetchWeatherApi } from 'openmeteo'
import z from 'zod'

const fetchCurrentWeather = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.inputValidator(
		z.object({
			latitude: z.number().min(-90).max(90),
			longitude: z.number().min(-180).max(180),
		}),
	)
	.handler(async ({ data: { latitude, longitude }, context: { config } }) => {
		const { signal } = getRequest()
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
				temperature_unit: config.units === 'metric' ? 'celsius' : 'fahrenheit',
				wind_speed_unit: config.units === 'metric' ? 'kmh' : 'mph',
				precipitation_unit: config.units === 'metric' ? 'mm' : 'inch',
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
			temperature: response.current.variables(0)!.value(),
			relativeHumidity: response.current.variables(1)!.value(),
			apparentTemperature: response.current.variables(2)!.value(),
			precipitation: response.current.variables(3)!.value(),
			weatherCode: response.current.variables(4)!.value(),
			surfacePressure: response.current.variables(5)!.value(),
			units: {
				temperature: config.units === 'metric' ? '°C' : '°F',
				windSpeed: config.units === 'metric' ? 'km/h' : 'mph',
				precipitation: config.units === 'metric' ? 'mm' : 'inch',
			},
		}
	})

export const weatherDataQuery = (locationData?: { latitude: number; longitude: number }) =>
	queryOptions({
		queryKey: ['openMeteo', 'currentWeather', locationData],
		queryFn: isNil(locationData)
			? skipToken
			: async ({ signal }) => fetchCurrentWeather({ data: locationData, signal }),
	})
