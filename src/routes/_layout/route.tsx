import { flattenDashboardWidgets } from '#lib/config/dashboardItems'
import { configMiddleware } from '#lib/config/middleware'
import { widgets as widgetsDefs } from '#widgets'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { groupBy } from 'es-toolkit'
import { Fragment } from 'react'
import { Header } from './-components/Header'

const getData = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.handler(
		({
			context: {
				config: { title, baseUrl, widgets },
			},
		}) => {
			const links = groupBy(
				flattenDashboardWidgets(widgets).flatMap(widget => {
					const widgetDef = widgetsDefs[widget.type]
					// @ts-expect-error should be correct based on the provideLinks definition in the widget definitions.
					return widgetDef.provideLinks?.(widget.options) ?? []
				}),
				link => link.type,
			)

			return {
				title,
				baseUrl,
				links,
			}
		},
	)

const Layout = () => {
	const { title, links } = Route.useLoaderData()

	return (
		<Fragment>
			<Header
				title={title ?? 'Homelab Dashboard'}
				links={links}
			/>
			<Outlet />
		</Fragment>
	)
}

export const Route = createFileRoute('/_layout')({
	component: Layout,
	loader: async () => await getData(),
	errorComponent: ({ error }) => (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">An error occurred</h1>
			<pre className="text-red-600">{error.message}</pre>
		</div>
	),
})
