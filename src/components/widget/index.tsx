import { Card } from '#components/card'
import { widgets, type WidgetType } from '#widgets'
import { CircleAlertIcon, RotateCcwIcon } from 'lucide-react'
import { FunctionComponent, useState } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { styles } from './style.css'

type WidgetProps = {
	definition: WidgetType
}

export const Widget: FunctionComponent<WidgetProps> = ({ definition }) => {
	const [{ Component }] = useState(() => widgets[definition.type])

	return (
		<ErrorBoundary
			fallbackRender={errorProps => (
				<WidgetErrorFallback
					{...errorProps}
					columns={definition.columns}
				/>
			)}
		>
			{/* @ts-expect-error */}
			<Component {...definition} />
		</ErrorBoundary>
	)
}

type WidgetErrorFallbackProps = FallbackProps & {
	columns?: number
}

const WidgetErrorFallback: FunctionComponent<WidgetErrorFallbackProps> = ({
	error,
	resetErrorBoundary,
	columns = 1,
}) => (
	<Card.Root
		className={styles.errorRoot}
		tone="danger"
		style={{ gridColumn: `span ${columns}` }}
	>
		<Card.Content
			className={styles.errorContent}
			padding="lg"
			gap="md"
		>
			<Card.Header className={styles.errorHeader}>
				<CircleAlertIcon size={24} />
				<span className={styles.errorMessage}>
					{error instanceof Error ? error.message : 'An unexpected error occurred.'}
				</span>
			</Card.Header>
			<button
				className={styles.errorButton}
				onClick={resetErrorBoundary}
			>
				<RotateCcwIcon size={16} />
				Try again
			</button>
		</Card.Content>
	</Card.Root>
)
