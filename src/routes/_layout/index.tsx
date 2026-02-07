import { createFileRoute } from '@tanstack/react-router'

import { CommandPalette } from '@/components/CommandPalette'
import { Widget } from '@/components/Widget'

const DashboardPage = () => {
	const { config } = Route.useRouteContext()

	return (
		<div>
			<CommandPalette config={config} />
			<div className="grid grid-cols-12 gap-4">
				{config.widgets.map((definition, index) => {
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
		// middleware: [authMiddleware],
	},
	component: DashboardPage,
})
