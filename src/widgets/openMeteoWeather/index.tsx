import { Card } from '#components/card'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { locationQuery } from '#services/location'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { match } from 'ts-pattern'
import { defineWidget } from '../helpers'
import { weatherDataQuery } from './data'
import { openMeteoWeatherOptions } from './schema'
import { styles } from './style.css'
import { getWMO } from './utils'

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
		const weatherQuery = useQuery(weatherDataQuery(locationData))

		if (locationError) {
			throw new Error(`Failed to determine location: ${locationError.message}`)
		}

		if (weatherQuery.error) {
			throw new Error(`Failed to fetch weather data: ${weatherQuery.error.message}`)
		}

		const { icon: WeatherIcon, label: weatherDescription } = getWMO(weatherQuery.data?.weatherCode)

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div className={styles.glow} />
				<Card.Content
					className={styles.content}
					padding="lg"
					gap="md"
				>
					<div className={styles.topRow}>
						<Card.Eyebrow>Weather</Card.Eyebrow>
						{weatherQuery.data?.time && (
							<span className={styles.timestamp}>Updated {format(weatherQuery.data.time, 'HH:mm')}</span>
						)}
					</div>
					{match(weatherQuery)
						.with({ status: 'pending' }, () => (
							<>
								<div className={styles.heroRow}>
									<div className={styles.tempBlock}>
										<Skeleton
											height={52}
											width={180}
										/>
										<Skeleton
											height={16}
											width={96}
										/>
									</div>
									<div className={styles.feelsChip}>
										<Skeleton
											height={12}
											width={56}
										/>
										<Skeleton
											height={28}
											width={44}
										/>
									</div>
								</div>
								<Card.Divider />
								<div className={styles.skeletonStatRow}>
									{Array.from({ length: 3 }, (_, skeletonIdx) => (
										<Skeleton
											key={skeletonIdx}
											height={56}
										/>
									))}
								</div>
							</>
						))
						.otherwise(({ data }) => (
							<>
								<div className={styles.heroRow}>
									<div className={styles.tempBlock}>
										<span className={styles.temperature}>
											{`${Math.round(data.temperature)}${data?.units.temperature}`}
											<WeatherIcon className={styles.weatherIcon} />
										</span>
										<span className={styles.condition}>{weatherDescription}</span>
									</div>
									<div className={styles.feelsChip}>
										<span className={styles.feelsLabel}>Feels like</span>
										<span className={styles.feelsValue}>
											{`${Math.round(data.apparentTemperature)}${data?.units.temperature}`}
										</span>
									</div>
								</div>
								<Card.Divider />
								<Stat.Row>
									<Stat.Item
										value={`${Math.round(data.relativeHumidity)}%`}
										label="Humidity"
									/>
									<Stat.Item
										value={`${data.precipitation.toFixed(1)} ${data?.units.precipitation}`}
										label="Precip."
									/>
									<Stat.Item
										value={`${Math.round(data.surfacePressure)} hPa`}
										label="Pressure"
									/>
								</Stat.Row>
							</>
						))}
				</Card.Content>
			</Card.Root>
		)
	},
})
