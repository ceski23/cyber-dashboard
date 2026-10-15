import '#theme.css'
import '#global.css'
import { ErrorCard } from '#components/errorCard'
import { getTheme, useTheme } from '#lib/utils/theme'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { hotkeysDevtoolsPlugin } from '@tanstack/react-hotkeys-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import lightIcon from '../assets/icon-light.svg?url'
import darkIcon from '../assets/icon.svg?url'
import appCss from '../styles.css?url'

type MyRouterContext = {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	errorComponent: ErrorCard,
	loader: () => ({ theme: getTheme() }),
	head: ({ loaderData }) => ({
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
			...(loaderData?.theme === 'light' || loaderData?.theme === 'dark'
				? [{ rel: 'icon', type: 'image/svg+xml', href: loaderData.theme === 'light' ? lightIcon : darkIcon }]
				: [
						{ rel: 'icon', type: 'image/svg+xml', href: lightIcon, media: '(prefers-color-scheme: light)' },
						{ rel: 'icon', type: 'image/svg+xml', href: darkIcon, media: '(prefers-color-scheme: dark)' },
					]),
			...(import.meta.env.PROD
				? [
						{ rel: 'icon', href: '/favicon.ico', sizes: 'any' },
						{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
						{ rel: 'manifest', href: '/manifest.webmanifest' },
					]
				: []),
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),
	shellComponent: ({ children }) => (
		<html
			lang="en"
			data-theme={useTheme().theme}
		>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
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
						hotkeysDevtoolsPlugin(),
					]}
				/>
				<Scripts />
			</body>
		</html>
	),
})
