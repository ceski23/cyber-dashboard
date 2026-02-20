import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Widget } from '@/components/widget'
import { authMiddleware } from '@/lib/auth/middleware'
import { configMiddleware } from '@/lib/config/middleware'

const fetchData = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.handler(async ({ context: { config } }) => ({
		widgets: config.widgets,
	}))

const DashboardPage = () => {
	const { widgets } = Route.useLoaderData()

	return (
		<div>
			<div className="grid grid-cols-12 gap-4">
				{widgets.map((definition, index) => {
					if ('widgets' in definition) {
						return (
							<div
								key={`group-${index}`}
								style={{ gridColumn: `span ${definition.columns ?? 1}` }}
							>
								<div>{definition.name}</div>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: `repeat(${definition.columns ?? 1}, 1fr)`,
										gap: '1rem',
									}}
								>
									{definition.widgets.map(widgetDef => (
										<Widget
											key={widgetDef.id}
											definition={widgetDef}
										/>
									))}
								</div>
							</div>
						)
					}

					return (
						<Widget
							key={definition.id}
							definition={definition}
						/>
					)
				})}
			</div>
		</div>
	)
}

export const Route = createFileRoute('/_layout/')({
	server: {
		middleware: [authMiddleware],
	},
	loader: async () => await fetchData(),
	component: DashboardPage,
})
