import { AuthClientProvider, createAuthClient } from '#lib/auth/client'
import { configMiddleware } from '#lib/config/middleware'
import { widgets as widgetsDefs } from '#widgets'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { groupBy } from 'es-toolkit'
import { useState } from 'react'
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
				widgets.flatMap(widgetOrGroup => {
					const widgetList = 'widgets' in widgetOrGroup ? widgetOrGroup.widgets : [widgetOrGroup]
					return widgetList.flatMap(widget => {
						const widgetDef = widgetsDefs[widget.type]
						// @ts-expect-error should be correct based on the provideLinks definition in the widget definitions.
						return widgetDef.provideLinks?.(widget.options) ?? []
					})
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
	const { baseUrl, title, links } = Route.useLoaderData()
	const [authClient] = useState(() => createAuthClient(baseUrl))

	return (
		<AuthClientProvider value={authClient}>
			<Header
				title={title ?? 'Homelab Dashboard'}
				links={links}
			/>
			<Outlet />
		</AuthClientProvider>
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
