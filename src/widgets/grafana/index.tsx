import { Card } from '#components/card'
import { Skeleton } from '#components/skeleton'
import { Stat } from '#components/stat'
import { vars } from '#theme.css'
import { useQuery } from '@tanstack/react-query'
import { isNotNil } from 'es-toolkit'
import { defineWidget } from '../helpers'
import { grafanaDataQuery } from './data'
import { grafanaOptions } from './schema'
import { styles } from './style.css'

const GRAFANA_ICON_URL = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/grafana.svg'

const formatValue = (value: number, unit: string | undefined): string => {
	const hasUnit = unit !== undefined

	if (hasUnit) {
		return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
	}

	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1)}M`
	}

	if (value >= 1_000) {
		return `${(value / 1_000).toFixed(1)}K`
	}

	if (Number.isInteger(value)) {
		return value.toLocaleString()
	}

	return Number(value.toFixed(2)).toString()
}

export const grafana = defineWidget({
	type: 'grafana',
	optionsSchema: grafanaOptions,
	loader: async (queryClient, { grafanaUrl, datasourceUid, token, queries, refreshInterval }) => {
		await queryClient.prefetchQuery(grafanaDataQuery(grafanaUrl, datasourceUid, token, queries, refreshInterval))
	},
	Component: ({ options: { name, grafanaUrl, datasourceUid, token, icon, queries, refreshInterval }, columns }) => {
		const { data, isLoading, error } = useQuery(
			grafanaDataQuery(grafanaUrl, datasourceUid, token, queries, refreshInterval),
		)

		if (error) throw new Error(`Failed to load Grafana query data: ${error.message}`)

		const successCount = data?.filter(result => isNotNil(result.value)).length ?? 0
		const hasErrors = data?.some(result => result.value === null) ?? false

		return (
			<Card.Root
				className={styles.root}
				style={{ gridColumn: `span ${columns ?? 1}` }}
			>
				<div
					className={styles.glow({
						status: isLoading ? 'loading' : hasErrors && successCount === 0 ? 'error' : 'success',
					})}
				/>

				<Card.Header
					className={styles.header}
					label={name}
					labelHref={grafanaUrl}
					icon={
						<img
							src={icon ?? GRAFANA_ICON_URL}
							alt={name}
							className={styles.icon}
						/>
					}
				/>

				<Stat.Row
					columns={queries.length}
					className={styles.statsRow}
				>
					{isLoading
						? Array.from({ length: queries.length }, (_, skeletonIdx) => (
								<Skeleton
									key={skeletonIdx}
									borderRadius={vars.radius.lg}
									height={56}
								/>
							))
						: data?.map((result, resultIdx) => (
								<Stat.Item
									key={resultIdx}
									value={
										isNotNil(result.value)
											? `${formatValue(result.value, result.unit)}${result.unit !== undefined ? ` ${result.unit}` : ''}`
											: '—'
									}
									label={result.label}
								/>
							))}
				</Stat.Row>
			</Card.Root>
		)
	},
})
