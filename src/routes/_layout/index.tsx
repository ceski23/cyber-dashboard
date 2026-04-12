import { Widget } from '#components/widget'
import { flattenDashboardWidgets } from '#lib/config/dashboardItems'
import { configMiddleware } from '#lib/config/middleware'
import type { DashboardItem } from '#lib/config/schema'
import { widgets as widgetsDefs } from '#widgets'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { isNotNil, withTimeout } from 'es-toolkit'
import { ms } from 'ms'
import { match, P } from 'ts-pattern'
import * as styles from './-components/index.css'

const fetchData = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.handler(async ({ context: { config } }) => ({
		widgets: config.widgets,
	}))

const getDashboardItemKey = (_item: DashboardItem, index: number) => `item-${index}`

const DashboardItemView = ({ definition }: { definition: DashboardItem }) =>
	match(definition)
		.with({ type: 'stack' }, stack => (
			<div
				className={styles.stack}
				style={{ gridColumn: `span ${stack.columns}` }}
			>
				{stack.widgets.map((widgetDef, index) => (
					<DashboardItemView
						key={getDashboardItemKey(widgetDef, index)}
						definition={widgetDef}
					/>
				))}
			</div>
		))
		.with({ widgets: P._ }, group => {
			const cols = group.columns ?? 1

			return (
				<div
					className={styles.group}
					style={{ gridColumn: `span ${cols}` }}
				>
					{isNotNil(group.name) && (
						<div className={styles.groupHeader}>
							<span className={styles.groupLabel}>{group.name}</span>
							<div className={styles.groupRule} />
						</div>
					)}
					<div
						className={styles.groupWidgets}
						style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
					>
						{group.widgets.map((widgetDef, index) => (
							<DashboardItemView
								key={getDashboardItemKey(widgetDef, index)}
								definition={widgetDef}
							/>
						))}
					</div>
				</div>
			)
		})
		.otherwise(widget => <Widget definition={widget} />)

const DashboardPage = () => {
	const { widgets } = Route.useLoaderData()

	return (
		<div className={styles.page}>
			<div className={styles.grid}>
				{widgets.map((definition, index) => (
					<DashboardItemView
						key={getDashboardItemKey(definition, index)}
						definition={definition}
					/>
				))}
			</div>
		</div>
	)
}

export const Route = createFileRoute('/_layout/')({
	loader: async ({ context }) => {
		const { widgets } = await fetchData()
		const prefetchPromises = flattenDashboardWidgets(widgets)
			.flatMap(widget => {
				const widgetDef = widgetsDefs[widget.type]
				// @ts-expect-error should be correct based on the loader definition in the widget definitions.
				return widgetDef.loader?.(context.queryClient, widget.options)
			})
			.filter(isNotNil)
			.map(promise => withTimeout(() => promise, ms('1s')))

		await Promise.allSettled(prefetchPromises)

		return {
			widgets,
		}
	},
	component: DashboardPage,
})
