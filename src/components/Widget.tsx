import { FunctionComponent, useState } from 'react'

import { widgets, type WidgetType } from '@/widgets'

type WidgetProps = {
	definition: WidgetType
}

export const Widget: FunctionComponent<WidgetProps> = ({ definition }) => {
	const [{ Component }] = useState(() => widgets[definition.type])

	// @ts-expect-error
	return <Component {...definition} />
}
