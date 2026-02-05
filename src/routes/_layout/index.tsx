import { createFileRoute } from '@tanstack/react-router'

import { Widget } from '@/components/Widget'

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
		// middleware: [authMiddleware],
	},
	component: DashboardPage,
})
