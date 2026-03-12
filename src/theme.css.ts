import { createGlobalTheme, globalStyle } from '@vanilla-extract/css'
import { transparentize } from './lib/utils/style'

export const media = {
	sm: '(width >= 640px)',
	md: '(width >= 768px)',
	lg: '(width >= 1024px)',
	xl: '(width >= 1280px)',
}

const colors = createGlobalTheme(':root', {
	'@layer': 'theme.colors',
	neutral: {
		500: 'light-dark(oklch(55.6% 0 0), oklch(55.6% 0 0))',
	},
	red: {
		400: 'light-dark(oklch(57% 0.191 22.216), oklch(70.4% 0.191 22.216))',
		500: 'light-dark(oklch(50% 0.237 25.331), oklch(63.7% 0.237 25.331))',
	},
	amber: {
		400: 'light-dark(oklch(62% 0.189 84.429), oklch(82.8% 0.189 84.429))',
		500: 'light-dark(oklch(57% 0.188 70.08), oklch(76.9% 0.188 70.08))',
	},
	black: 'oklch(0% 0 0)',
	white: 'oklch(100% 0 0)',
	transparent: 'transparent',
})

const spacing = createGlobalTheme(':root', {
	'@layer': 'theme.spacing',
	base: '0.25rem',
})

export const vars = createGlobalTheme(':root', {
	'@layer': 'theme',
	color: {
		...colors,
		primary: 'light-dark(oklch(42% 0.233 277.117), oklch(58.5% 0.233 277.117))',
		background: `light-dark(oklch(98% 0.003 286), ${colors.black})`,
		backgroundAlt: 'light-dark(oklch(92% 0.006 286), oklch(0.2739 0.0055 286.03))',
		foreground: 'light-dark(oklch(11% 0.012 286), oklch(0.9674 0.0013 286.37))',
		foregroundAlt: 'light-dark(oklch(22% 0.012 286), oklch(0.8711 0.0055 286.29))',
		foregroundMuted: 'light-dark(oklch(42% 0.012 286), oklch(0.5517 0.0138 285.94))',
		panel: 'light-dark(oklch(97% 0.003 286 / 80%), oklch(0.2103 0.0059 285.89 / 55%))',
		border: `light-dark(oklch(0% 0 0 / 14%), ${transparentize(colors.white, 0.1)})`,
		borderSubtle: `light-dark(oklch(0% 0 0 / 7%), ${transparentize(colors.white, 0.05)})`,
		success: 'light-dark(oklch(52% 0.18 142), oklch(72% 0.18 142))',
		warning: colors.amber[500],
		error: colors.red[500],
		aqi: {
			good: 'oklch(0.72 0.18 142)',
			fair: 'oklch(0.85 0.17 100)',
			moderate: 'oklch(0.77 0.18 70)',
			poor: 'oklch(0.70 0.18 45)',
			veryPoor: 'oklch(0.65 0.22 25)',
			extremelyPoor: 'oklch(0.60 0.18 300)',
			unknown: 'oklch(0.5517 0.0138 285.94)',
		},
	},
	spacing: {
		/** 2px */
		0.5: `calc(${spacing.base} * 0.5)`,
		/** 4px */
		1: `calc(${spacing.base} * 1)`,
		/** 6px */
		1.5: `calc(${spacing.base} * 1.5)`,
		/** 8px */
		2: `calc(${spacing.base} * 2)`,
		/** 12px */
		3: `calc(${spacing.base} * 3)`,
		/** 16px */
		4: `calc(${spacing.base} * 4)`,
		/** 20px */
		5: `calc(${spacing.base} * 5)`,
		/** 24px */
		6: `calc(${spacing.base} * 6)`,
		/** 32px */
		8: `calc(${spacing.base} * 8)`,
		/** 40px */
		10: `calc(${spacing.base} * 10)`,
		/** 48px */
		12: `calc(${spacing.base} * 12)`,
		/** 64px */
		16: `calc(${spacing.base} * 16)`,
		/** 72px */
		18: `calc(${spacing.base} * 18)`,
		/** 80px */
		20: `calc(${spacing.base} * 20)`,
		/** 96px */
		24: `calc(${spacing.base} * 24)`,
		/** 128px */
		32: `calc(${spacing.base} * 32)`,
		/** 160px */
		40: `calc(${spacing.base} * 40)`,
		/** 192px */
		48: `calc(${spacing.base} * 48)`,
		/** 224px */
		56: `calc(${spacing.base} * 56)`,
		/** 256px */
		64: `calc(${spacing.base} * 64)`,
	},
	text: {
		/** 10px */
		xxs: '0.625rem',
		/** 12px */
		xs: '0.75rem',
		/** 14px */
		sm: '0.875rem',
		/** 16px */
		base: '1rem',
		/** 18px */
		lg: '1.125rem',
		/** 20px */
		xl: '1.25rem',
		/** 24px */
		'2xl': '1.5rem',
		/** 30px */
		'3xl': '1.875rem',
		/** 36px */
		'4xl': '2.25rem',
		/** 48px */
		'5xl': '3rem',
		/** 60px */
		'6xl': '3.75rem',
		/** 72px */
		'7xl': '4.5rem',
		/** 96px */
		'8xl': '6rem',
		/** 128px */
		'9xl': '8rem',
	},
	font: {
		sans: 'Inter Variable, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
	},
	radius: {
		/** 0px */
		none: '0',
		/** 2px */
		sm: '0.125rem',
		/** 6px */
		md: '0.375rem',
		/** 8px */
		lg: '0.5rem',
		/** 12px */
		xl: '0.75rem',
		/** 16px */
		'2xl': '1rem',
		/** 24px */
		'3xl': '1.5rem',
		/** 32px */
		'4xl': '2rem',
		/** 9999px */
		full: '9999px',
	},
	shadow: {
		panel: '0 10px 30px rgba(0, 0, 0, 0.35)',
		glowBlue: '0 0 10px rgba(59, 130, 246, 0.35)',
		glowEmerald: '0 0 10px rgba(16, 185, 129, 0.4)',
		glowRed: '0 0 10px rgba(239, 68, 68, 0.4)',
	},
})

globalStyle('[data-theme="light"]', {
	colorScheme: 'light',
})

globalStyle('[data-theme="dark"]', {
	colorScheme: 'dark',
})

globalStyle('[data-theme="auto"]', {
	colorScheme: 'light dark',
})
