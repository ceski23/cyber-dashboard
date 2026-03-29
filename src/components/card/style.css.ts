import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const root = recipe({
	base: {
		position: 'relative',
		overflow: 'hidden',
		borderRadius: vars.radius.xl,
		border: `1px solid ${vars.color.borderSubtle}`,
		background: vars.color.panel,
		color: vars.color.foreground,
		boxSizing: 'border-box',
		backdropFilter: 'blur(10px)',
		transition:
			'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease, background-color 0.2s ease, color 0.2s ease',
	},
	variants: {
		tone: {
			default: {},
			success: {
				color: vars.color.success,
				backgroundColor: transparentize(vars.color.success, 0.06),
				borderColor: transparentize(vars.color.success, 0.2),
			},
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
		interactive: {
			false: {},
			true: {
				cursor: 'pointer',
				':hover': {
					borderColor: vars.color.border,
					transform: 'translateY(-2px)',
					boxShadow: vars.shadow.panel,
				},
			},
		},
	},
	defaultVariants: {
		tone: 'default',
		interactive: false,
	},
})

export const content = recipe({
	base: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		boxSizing: 'border-box',
	},
	variants: {
		padding: {
			none: {},
			md: {
				padding: vars.spacing[4],
			},
			lg: {
				padding: vars.spacing[5],
			},
		},
		gap: {
			none: {},
			sm: {
				gap: vars.spacing[2],
			},
			md: {
				gap: vars.spacing[4],
			},
		},
	},
	defaultVariants: {
		padding: 'none',
		gap: 'none',
	},
})

export const header = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.spacing[2],
})

export const eyebrow = style({
	fontSize: vars.text.xxs,
	fontWeight: 700,
	letterSpacing: '0.12em',
	textTransform: 'uppercase',
	color: vars.color.foregroundMuted,
})

export const divider = style({
	height: '1px',
	background: transparentize(vars.color.white, 0.06),
})

export const iconRow = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.spacing[2],
})

export const iconBadge = style({
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
})

export const label = style({
	fontWeight: 500,
	fontSize: vars.text.sm,
	color: vars.color.foregroundAlt,
})

export const labelLink = style([
	label,
	{
		textDecoration: 'none',
		':hover': {
			textDecoration: 'underline',
		},
	},
])
