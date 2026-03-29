import { Card } from '#components/card'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { locationQuery } from '#services/location'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { match } from 'ts-pattern'
import { defineWidget } from '../helpers'
import { airQualityDataQuery } from './data'
import { openMeteoAirQualityOptions } from './schema'
import { styles } from './style.css'
import { getAqiInfo } from './utils'

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
		const airQualityQuery = useQuery(airQualityDataQuery(locationData))

		if (locationError) {
			throw new Error(`Failed to determine location: ${locationError.message}`)
		}

		if (airQualityQuery.error) {
			throw new Error(`Failed to fetch air quality data: ${airQualityQuery.error.message}`)
		}

		const aqiInfo = getAqiInfo(airQualityQuery.data?.europeanAqi)

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div className={styles.glow({ tier: aqiInfo.tier })} />

				<Card.Content
					className={styles.content}
					padding="lg"
					gap="md"
				>
					<div className={styles.topRow}>
						<Card.Eyebrow>Air Quality</Card.Eyebrow>
						{airQualityQuery.data?.time && (
							<span className={styles.timestamp}>
								Updated {format(airQualityQuery.data.time, 'HH:mm')}
							</span>
						)}
					</div>

					{match(airQualityQuery)
						.with({ status: 'pending' }, () => (
							<>
								<div className={styles.heroRow}>
									<div className={styles.aqiBlock}>
										<Skeleton
											height={52}
											width={80}
										/>
										<Skeleton
											height={16}
											width={96}
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
									<div className={styles.aqiBlock}>
										<span className={styles.aqiScore({ tier: aqiInfo.tier })}>
											{Math.round(data.europeanAqi)}
										</span>
										<span className={styles.aqiLabel}>{aqiInfo.label}</span>
									</div>
								</div>
								<Card.Divider />
								<Stat.Row>
									<Stat.Item
										value={`${data.pm25.toFixed(1)} µg/m³`}
										label="PM 2.5"
									/>
									<Stat.Item
										value={`${data.pm10.toFixed(1)} µg/m³`}
										label="PM 10"
									/>
									<Stat.Item
										value={`${data.carbonMonoxide.toFixed(1)} µg/m³`}
										label="CO"
									/>
								</Stat.Row>
							</>
						))}
				</Card.Content>
			</Card.Root>
		)
	},
})
