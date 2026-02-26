import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import circleDependency from 'vite-plugin-circular-dependency'

const config = defineConfig({
	envPrefix: 'PUBLIC_',
	plugins: [
		devtools({
			enhancedLogs: {
				enabled: false,
			},
			consolePiping: {
				enabled: false,
			},
		}),
		vanillaExtractPlugin(),
		tanstackStart(),
		viteReact(),
		circleDependency(),
	],
	optimizeDeps: {
		exclude: ['cpu-features', 'ssh2'],
	},
})

export default config
