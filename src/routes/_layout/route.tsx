import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'

import Header from '@/components/Header'
import { serverEnv } from '@/env'
import { AuthClientProvider, createAuthClient } from '@/lib/auth/client'
import { configSchema, type Config } from '@/lib/config'

const getRuntimeEnvs = createServerFn({ method: 'GET' }).handler(() => ({
	BETTER_AUTH_URL: serverEnv.BETTER_AUTH_URL,
}))

const fetchConfig = createServerFn({ method: 'GET' }).handler(async (): Promise<Config> => {
	const configFile = Bun.file('config.json')
	const configText = await configFile.text()
	const configData = configSchema.parse(JSON.parse(configText))

	return configData
})

const Layout = () => {
	const { runtimeEnvs } = Route.useRouteContext()
	const [authClient] = useState(() => createAuthClient(runtimeEnvs.BETTER_AUTH_URL))

	return (
		<AuthClientProvider value={authClient}>
			<Header />
			<Outlet />
		</AuthClientProvider>
	)
}

export const Route = createFileRoute('/_layout')({
	component: Layout,
	beforeLoad: async () => ({
		runtimeEnvs: await getRuntimeEnvs(),
		config: await fetchConfig(),
	}),
	errorComponent: ({ error }) => (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">An error occurred</h1>
			<pre className="text-red-600">{error.message}</pre>
		</div>
	),
})
