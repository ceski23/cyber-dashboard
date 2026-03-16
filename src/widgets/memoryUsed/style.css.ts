import { getVarName } from '#lib/utils/style'
import { vars } from '#theme.css'
import { createVar, style } from '@vanilla-extract/css'

export const memoryVar = createVar({
	syntax: '<integer>',
	initialValue: '0',
	inherits: false,
})

export const styles = {
	root: style({
		height: vars.spacing[32],
	}),

	chartOverlay: style({
		position: 'absolute',
		inset: 0,
		pointerEvents: 'none',
		zIndex: 0,
		opacity: 0.4,
		maskImage: 'linear-gradient(to right, transparent, transparent 140px, black 240px)',
		paddingLeft: 100,
	}),

	content: style({
		height: '100%',
		justifyContent: 'space-between',
	}),

	meta: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		fontVariantNumeric: 'tabular-nums',
		flexShrink: 0,
	}),

	value: style({
		transition: `${getVarName(memoryVar)} 1s ease-out`,
		counterReset: `memory ${memoryVar}`,
		fontSize: vars.text['4xl'],
		fontWeight: 700,
		color: vars.color.foreground,
		lineHeight: 1,
		position: 'relative',
		marginRight: 'auto',
		'::before': {
			content: 'counter(memory)',
		},
		'::after': {
			content: '%',
			position: 'absolute',
			transform: 'translateX(100%)',
			right: 0,
			bottom: 0,
			top: 0,
			paddingLeft: vars.spacing[1],
			display: 'flex',
			alignItems: 'flex-end',
			opacity: 0.5,
			fontSize: vars.text['2xl'],
			fontWeight: 700,
			color: vars.color.foreground,
		},
	}),
}
