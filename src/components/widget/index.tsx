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
	<div
		className={styles.errorRoot}
		style={{ gridColumn: `span ${columns}` }}
	>
		<div className={styles.errorHeader}>
			<CircleAlertIcon size={24} />
			<span className={styles.errorMessage}>
				{error instanceof Error ? error.message : 'An unexpected error occurred.'}
			</span>
		</div>
		<button
			className={styles.errorButton}
			onClick={resetErrorBoundary}
		>
			<RotateCcwIcon size={16} />
			Try again
		</button>
	</div>
)
