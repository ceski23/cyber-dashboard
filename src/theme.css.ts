import { createGlobalTheme } from '@vanilla-extract/css'

import { transparentize } from './lib/utils/style'

export const media = {
	sm: '(width >= 640px)',
	md: '(width >= 768px)',
	lg: '(width >= 1024px)',
	xl: '(width >= 1280px)',
}

const colors = createGlobalTheme(':root', {
	'@layer': 'theme.colors',
	// indigo: {
	// 	50: 'oklch(96.2% 0.018 272.314)',
	// 	100: 'oklch(93% 0.034 272.788)',
	// 	200: 'oklch(87% 0.065 274.039)',
	// 	300: 'oklch(78.5% 0.115 274.713)',
	// 	400: 'oklch(67.3% 0.182 276.935)',
	// 	500: 'oklch(58.5% 0.233 277.117)',
	// 	600: 'oklch(51.1% 0.262 276.966)',
	// 	700: 'oklch(45.7% 0.24 277.023)',
	// 	800: 'oklch(39.8% 0.195 277.366)',
	// 	900: 'oklch(35.9% 0.144 278.697)',
	// 	950: 'oklch(25.7% 0.09 281.288)',
	// },
	// neutral: {
	// 	50: 'oklch(98.5% 0 0)',
	// 	100: 'oklch(97% 0 0)',
	// 	200: 'oklch(92.2% 0 0)',
	// 	300: 'oklch(87% 0 0)',
	// 	400: 'oklch(70.8% 0 0)',
	// 	500: 'oklch(55.6% 0 0)',
	// 	600: 'oklch(43.9% 0 0)',
	// 	700: 'oklch(37.1% 0 0)',
	// 	800: 'oklch(26.9% 0 0)',
	// 	900: 'oklch(20.5% 0 0)',
	// 	950: 'oklch(14.5% 0 0)',
	// },
	// zinc: {
	// 	50: 'oklch(98.5% 0 0)',
	// 	100: 'oklch(96.7% 0.001 286.375)',
	// 	200: 'oklch(92% 0.004 286.32)',
	// 	300: 'oklch(87.1% 0.006 286.286)',
	// 	400: 'oklch(70.5% 0.015 286.067)',
	// 	500: 'oklch(55.2% 0.016 285.938)',
	// 	600: 'oklch(44.2% 0.017 285.786)',
	// 	700: 'oklch(37% 0.013 285.805)',
	// 	800: 'oklch(27.4% 0.006 286.033)',
	// 	900: 'oklch(21% 0.006 285.885)',
	// 	950: 'oklch(14.1% 0.005 285.823)',
	// },
	// red: {
	// 	50: 'oklch(97.1% 0.013 17.38)',
	// 	100: 'oklch(93.6% 0.032 17.717)',
	// 	200: 'oklch(88.5% 0.062 18.334)',
	// 	300: 'oklch(80.8% 0.114 19.571)',
	// 	400: 'oklch(70.4% 0.191 22.216)',
	// 	500: 'oklch(63.7% 0.237 25.331)',
	// 	600: 'oklch(57.7% 0.245 27.325)',
	// 	700: 'oklch(50.5% 0.213 27.518)',
	// 	800: 'oklch(44.4% 0.177 26.899)',
	// 	900: 'oklch(39.6% 0.141 25.723)',
	// 	950: 'oklch(25.8% 0.092 26.042)',
	// },
	black: 'oklch(0% 0 0)',
	white: 'oklch(100% 0 0)',
	transparent: 'transparent',
})

export const vars = createGlobalTheme(':root', {
	'@layer': 'theme',
	color: {
		...colors,
		primary: 'oklch(58.5% 0.233 277.117)',
		background: colors.black,
		backgroundAlt: 'oklch(0.2739 0.0055 286.03)',
		foreground: 'oklch(0.9674 0.0013 286.37)',
		foregroundAlt: 'oklch(0.8711 0.0055 286.29)',
		foregroundMuted: 'oklch(0.5517 0.0138 285.94)',
		panel: 'oklch(0.2103 0.0059 285.89 / 55%)',
		border: transparentize(colors.white, 0.1),
		borderSubtle: transparentize(colors.white, 0.05),
	},
	spacing: {
		/** 2px */
		0.5: '0.125rem',
		/** 4px */
		1: '0.25rem',
		/** 6px */
		1.5: '0.375rem',
		/** 8px */
		2: '0.5rem',
		/** 12px */
		3: '0.75rem',
		/** 16px */
		4: '1rem',
		/** 20px */
		5: '1.25rem',
		/** 24px */
		6: '1.5rem',
		/** 32px */
		8: '2rem',
		/** 40px */
		10: '2.5rem',
		/** 48px */
		12: '3rem',
		/** 64px */
		16: '4rem',
		/** 72px */
		18: '4.5rem',
		/** 80px */
		20: '5rem',
		/** 96px */
		24: '6rem',
		/** 128px */
		32: '8rem',
		/** 160px */
		40: '10rem',
		/** 192px */
		48: '12rem',
		/** 224px */
		56: '14rem',
		/** 256px */
		64: '16rem',
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
