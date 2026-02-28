import { getVarName, transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const loadVar = createVar({
	syntax: '<integer>',
	initialValue: '0',
	inherits: false,
})

export const styles = {
	root: recipe({
		base: {
			position: 'relative',
			overflow: 'hidden',
			borderRadius: vars.radius.xl,
			border: `1px solid ${vars.color.borderSubtle}`,
			background: vars.color.panel,
			height: vars.spacing[32],
			transition: `border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease`,
		},
		variants: {
			status: {
				normal: {},
				warning: {
					color: vars.color.amber[400],
					backgroundColor: transparentize(vars.color.amber[500], 0.05),
					borderColor: transparentize(vars.color.amber[500], 0.2),
				},
				danger: {
					color: vars.color.red[400],
					backgroundColor: transparentize(vars.color.red[500], 0.05),
					borderColor: transparentize(vars.color.red[500], 0.2),
				},
			},
		},
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
		position: 'relative',
		padding: vars.spacing[5],
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		boxSizing: 'border-box',
	}),

	header: style({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: vars.spacing[2],
	}),

	iconRow: style({
		display: 'flex',
		alignItems: 'center',
		gap: vars.spacing[2],
	}),

	iconBadge: style({
		width: '30px',
		height: '30px',
		borderRadius: vars.radius.md,
		background: transparentize(vars.color.background, 0.4),
		border: `1px solid ${vars.color.border}`,
		color: vars.color.foregroundMuted,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
	}),

	label: style({
		fontSize: vars.text.sm,
		color: vars.color.foregroundAlt,
		fontWeight: 500,
	}),

	meta: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		fontVariantNumeric: 'tabular-nums',
		flexShrink: 0,
	}),

	value: style({
		transition: `${getVarName(loadVar)} 1s ease-out`,
		counterReset: `load ${loadVar}`,
		fontSize: vars.text['4xl'],
		fontWeight: 700,
		color: vars.color.foreground,
		lineHeight: 1,
		position: 'relative',
		marginRight: 'auto',
		'::before': {
			content: 'counter(load)',
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
