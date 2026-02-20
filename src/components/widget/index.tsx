import { CircleAlertIcon } from 'lucide-react'
import { FunctionComponent, useState } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

import { widgets, type WidgetType } from '@/widgets'

import { errorRoot } from './style.css'

type WidgetProps = {
	definition: WidgetType
}

export const Widget: FunctionComponent<WidgetProps> = ({ definition }) => {
	const [{ Component }] = useState(() => widgets[definition.type])

	return (
		<ErrorBoundary FallbackComponent={WidgetErrorFallback}>
			{/* @ts-expect-error */}
			<Component {...definition} />
		</ErrorBoundary>
	)
}

const WidgetErrorFallback: FunctionComponent<FallbackProps> = ({ error, resetErrorBoundary }) => (
	<div className={errorRoot}>
		<CircleAlertIcon size={18} />
		{error instanceof Error ? error.message : 'An unexpected error occurred.'}
		<button onClick={resetErrorBoundary}>Try again</button>
	</div>
)
