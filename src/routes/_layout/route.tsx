import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'

import Header from '@/components/Header'
import { AuthClientProvider, createAuthClient } from '@/lib/auth/client'
import { configMiddleware } from '@/lib/config/middleware'

const getData = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.handler(
		async ({
			context: {
				config: { title, baseUrl },
			},
		}) => ({
			title,
			baseUrl,
		}),
	)

const Layout = () => {
	const { baseUrl, title } = Route.useLoaderData()
	const [authClient] = useState(() => createAuthClient(baseUrl))

	return (
		<AuthClientProvider value={authClient}>
			<Header title={title ?? 'Homelab Dashboard'} />
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
