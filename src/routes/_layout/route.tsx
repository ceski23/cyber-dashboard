import { OpenLinksInNewTabContext } from '#components/dashboardLink'
import { ErrorCard } from '#components/errorCard'
import { flattenDashboardWidgets } from '#lib/config/dashboardItems'
import { configMiddleware } from '#lib/config/middleware'
import { widgets as widgetsDefs } from '#widgets'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { groupBy } from 'es-toolkit'
import { Header } from './-components/Header'

const getData = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.handler(
		({
			context: {
				config: { title, baseUrl, widgets, openLinksInNewTab },
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
				openLinksInNewTab,
			}
		},
	)

const Layout = () => {
	const { title, links, openLinksInNewTab } = Route.useLoaderData()

	return (
		<OpenLinksInNewTabContext value={openLinksInNewTab}>
			<Header
				title={title ?? 'Homelab Dashboard'}
				links={links}
			/>
			<Outlet />
		</OpenLinksInNewTabContext>
	)
}

export const Route = createFileRoute('/_layout')({
	component: Layout,
	loader: async () => await getData(),
	errorComponent: ErrorCard,
})
