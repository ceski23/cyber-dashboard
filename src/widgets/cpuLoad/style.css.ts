import { getVarName } from '#lib/utils/style'
import { vars } from '#theme.css'
import { createVar, style } from '@vanilla-extract/css'

export const loadVar = createVar({
	syntax: '<integer>',
	initialValue: '0',
	inherits: false,
})

export const styles = {
	root: style({
		position: 'relative',
		overflow: 'hidden',
		borderRadius: vars.radius.xl,
		border: `1px solid ${vars.color.borderSubtle}`,
		background: vars.color.panel,
		height: vars.spacing[32],
	}),

	chartOverlay: style({
		position: 'absolute',
		inset: 0,
		pointerEvents: 'none',
		zIndex: 0,
	}),

	content: style({
		position: 'relative',
		zIndex: 1,
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
		background: 'oklch(58.5% 0.233 277.117 / 0.15)',
		color: vars.color.primary,
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
		fontSize: vars.text['5xl'],
		fontWeight: 600,
		color: vars.color.foreground,
		lineHeight: 1,
		'::after': {
			content: 'counter(load) "%"',
		},
	}),
}
