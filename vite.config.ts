import { fileURLToPath, URL } from 'url'

import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import circleDependency from 'vite-plugin-circular-dependency'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const config = defineConfig({
	envPrefix: 'PUBLIC_',
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	plugins: [
		devtools({
			enhancedLogs: {
				enabled: false,
			},
			consolePiping: {
				enabled: false,
			},
		}),
		viteTsConfigPaths({
			projects: ['./tsconfig.json'],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		circleDependency(),
	],
	optimizeDeps: {
		exclude: ['cpu-features', 'ssh2'],
	},
})

export default config
