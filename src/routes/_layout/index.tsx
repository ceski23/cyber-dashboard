import { Widget } from '#components/widget'
import { authMiddleware } from '#lib/auth/middleware'
import { configMiddleware } from '#lib/config/middleware'
import { widgets as widgetsDefs } from '#widgets'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { isNotNil } from 'es-toolkit'

import * as styles from './-components/index.css'

const fetchData = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.handler(async ({ context: { config } }) => ({
		widgets: config.widgets,
	}))

const DashboardPage = () => {
	const { widgets } = Route.useLoaderData()

	return (
		<div className={styles.page}>
			<div className={styles.grid}>
				{widgets.map((definition, index) => {
					if ('widgets' in definition) {
						const cols = definition.columns ?? 1
						return (
							<div
								key={`group-${index}`}
								className={styles.group}
								style={{ gridColumn: `span ${cols}` }}
							>
								{isNotNil(definition.name) && (
									<div className={styles.groupHeader}>
										<span className={styles.groupLabel}>{definition.name}</span>
										<div className={styles.groupRule} />
									</div>
								)}
								<div
									className={styles.groupWidgets}
									style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
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
	loader: async ({ context }) => {
		const { widgets } = await fetchData()
		const prefetchPromises = widgets
			.flatMap(widgetOrGroup => {
				const widgetList = 'widgets' in widgetOrGroup ? widgetOrGroup.widgets : [widgetOrGroup]
				return widgetList.flatMap(widget => {
					const widgetDef = widgetsDefs[widget.type]
					// @ts-expect-error should be correct based on the loader definition in the widget definitions.
					return widgetDef.loader?.(context.queryClient, widget.options)
				})
			})
			.filter(isNotNil)

		await Promise.all(prefetchPromises)

		return {
			widgets,
		}
	},
	component: DashboardPage,
})
