import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import circleDependency from 'vite-plugin-circular-dependency'
import { defineConfig } from 'vite-plus'

const config = defineConfig({
	staged: {
		'*': 'vp check',
	},
	fmt: {
		arrowParens: 'avoid',
		bracketSameLine: false,
		bracketSpacing: true,
		endOfLine: 'lf',
		jsxSingleQuote: false,
		objectWrap: 'preserve',
		printWidth: 120,
		semi: false,
		quoteProps: 'as-needed',
		singleAttributePerLine: true,
		singleQuote: true,
		tabWidth: 4,
		trailingComma: 'all',
		useTabs: true,
		ignorePatterns: ['src/routeTree.gen.ts', '.output'],
		sortImports: {
			newlinesBetween: false,
			groups: [['side_effect'], ['builtin'], ['external'], ['internal'], ['parent'], ['sibling'], ['index']],
		},
		sortPackageJson: false,
	},
	lint: {
		// extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
		plugins: ['react', 'react-perf', 'typescript'],
		ignorePatterns: ['src/components/ui/*'],
		rules: {
			'typescript/consistent-type-definitions': ['error', 'type'],
			'arrow-body-style': ['error', 'as-needed'],
			'func-style': ['error', 'expression'],
			'typescript/strict-boolean-expressions': ['error'],
		},
		options: {
			typeAware: true,
			typeCheck: true,
		},
	},
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
		nitro({ preset: 'bun' }),
		viteReact(),
		circleDependency(),
	],
	optimizeDeps: {
		exclude: ['cpu-features', 'ssh2'],
	},
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{
							name: 'vendor',
							test: /node_modules/,
							entriesAware: true,
							entriesAwareMergeThreshold: 20_000,
						},
					],
				},
			},
		},
	},
})

export default config
