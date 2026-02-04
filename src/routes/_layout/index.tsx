import { createFileRoute } from '@tanstack/react-router'

import { Widget } from '@/components/Widget'
import { authMiddleware } from '@/lib/auth/middleware'

const DashboardPage = () => {
	const { config } = Route.useRouteContext()

	return (
		<div>
			{config.widgets.map(definition => (
				<Widget
					key={definition.id}
					definition={definition}
				/>
			))}
		</div>
	)
}

export const Route = createFileRoute('/_layout/')({
	server: {
		middleware: [authMiddleware],
	},
	component: DashboardPage,
})
