import { getVarName, transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const storageVar = createVar({
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
			backdropFilter: 'blur(10px)',
			transition: `border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease`,
		},
		variants: {
			status: {
				normal: {
					color: vars.color.foregroundMuted,
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
		},
	}),

	content: style({
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

	bottom: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[2],
	}),

	value: style({
		transition: `${getVarName(storageVar)} 1s ease-out`,
		counterReset: `storage ${storageVar}`,
		fontSize: vars.text['4xl'],
		fontWeight: 700,
		color: vars.color.foreground,
		lineHeight: 1,
		position: 'relative',
		marginRight: 'auto',
		'::before': {
			content: 'counter(storage)',
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

	progressTrack: style({
		height: '4px',
		borderRadius: vars.radius.full,
		background: transparentize(vars.color.foreground, 0.1),
		overflow: 'hidden',
	}),

	progressBar: style({
		height: '100%',
		borderRadius: vars.radius.full,
		background: 'currentColor',
		transition: 'width 0.5s ease-out',
	}),
}
