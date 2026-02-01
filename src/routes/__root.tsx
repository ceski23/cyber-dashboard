import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'

import { serverEnv } from '@/env'
import { AuthClientProvider, createAuthClient } from '@/lib/auth/client'

import Header from '../components/Header'
import appCss from '../styles.css?url'

interface MyRouterContext {
	queryClient: QueryClient
}

const getRuntimeEnvs = createServerFn({ method: 'GET' }).handler(() => ({
	BETTER_AUTH_URL: serverEnv.BETTER_AUTH_URL,
}))

const RootDocument = ({ children }: { children: React.ReactNode }) => {
	const { env } = Route.useLoaderData()

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<AuthClientProvider value={createAuthClient(env.BETTER_AUTH_URL)}>
					<Header />
					{children}
				</AuthClientProvider>
				<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: 'Tanstack Query',
							render: <ReactQueryDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Homelab Dashboard',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	loader: async () => ({
		env: await getRuntimeEnvs(),
	}),
})
