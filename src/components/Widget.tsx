import { FunctionComponent, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { widgets, type WidgetType } from '@/widgets'

type WidgetProps = {
	definition: WidgetType
}

export const Widget: FunctionComponent<WidgetProps> = ({ definition }) => {
	const [{ Component }] = useState(() => widgets[definition.type])

	return (
		<ErrorBoundary
			fallbackRender={({ error }) => (
				<div className="text-destructive">
					Error: {error instanceof Error ? error.message : 'Unknown error'}
				</div>
			)}
		>
			{/* @ts-expect-error */}
			<Component {...definition} />
		</ErrorBoundary>
	)
}
