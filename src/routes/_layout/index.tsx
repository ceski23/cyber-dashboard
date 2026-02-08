import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { groupBy } from 'es-toolkit'

import { CommandPalette } from '@/components/CommandPalette'
import { Widget } from '@/components/Widget'
import { authMiddleware } from '@/lib/auth/middleware'
import { configMiddleware } from '@/lib/config/middleware'
import { widgets } from '@/widgets'

const fetchData = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.handler(async ({ context: { config } }) => {
		const links = groupBy(
			config.widgets.flatMap(widgetOrGroup => {
				const widgetList = 'widgets' in widgetOrGroup ? widgetOrGroup.widgets : [widgetOrGroup]
				return widgetList.flatMap(widget => {
					const widgetDef = widgets[widget.type]
					// @ts-expect-error should be correct based on the provideLinks definition in the widget definitions.
					return widgetDef.provideLinks?.(widget.options) ?? []
				})
			}),
			link => link.type,
		)

		return {
			widgets: config.widgets,
			links,
		}
	})

const DashboardPage = () => {
	const { widgets, links } = Route.useLoaderData()

	return (
		<div>
			<CommandPalette links={links} />
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
