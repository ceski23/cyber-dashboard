import { queryOptions, skipToken } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { isNil } from 'es-toolkit'
import { fetchWeatherApi } from 'openmeteo'
import z from 'zod'

const fetchAirQualityData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			latitude: z.number().min(-90).max(90),
			longitude: z.number().min(-180).max(180),
		}),
	)
	.handler(async ({ data: { latitude, longitude } }) => {
		const { signal } = getRequest()
		const response = await fetchWeatherApi(
			'https://air-quality-api.open-meteo.com/v1/air-quality',
			{
				latitude,
				longitude,
				current: ['pm10', 'pm2_5', 'european_aqi', 'carbon_monoxide'],
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
	})

export const airQualityDataQuery = (locationData?: { latitude: number; longitude: number }) =>
	queryOptions({
		queryKey: ['openMeteo', 'airQuality', locationData],
		queryFn: isNil(locationData)
			? skipToken
			: async ({ signal }) => fetchAirQualityData({ data: locationData, signal }),
	})
