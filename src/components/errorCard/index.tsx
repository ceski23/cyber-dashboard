import { Card } from '#components/card'
import { ConfigError } from '#lib/config/configError'
import type { ErrorRouteComponent } from '@tanstack/react-router'
import { CircleAlertIcon } from 'lucide-react'
import { useMemo } from 'react'
import { styles } from './style.css'

export const ErrorCard: ErrorRouteComponent = ({ error }) => {
	const { title, message } = useMemo(() => {
		if (error instanceof ConfigError) {
			return {
				title: 'Configuration Error',
				message: error.formatted,
			}
		}

		return {
			title: error.name,
			message: error.message,
		}
	}, [error])

	return (
		<div className={styles.root}>
			<Card.Root tone="danger">
				<Card.Content
					className={styles.content}
					padding="lg"
					gap="md"
				>
					<div className={styles.headerRow}>
						<CircleAlertIcon size={24} />
						<span className={styles.title}>{title}</span>
					</div>
					<div className={styles.codeFrame}>{message}</div>
				</Card.Content>
			</Card.Root>
		</div>
	)
}
