import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const styles = {
	root: style({
		minHeight: vars.spacing[48],
	}),

	glow: style({
		position: 'absolute',
		top: 0,
		right: 0,
		width: '100%',
		height: '100%',
		background: `radial-gradient(ellipse at 0% 0%, oklch(from ${vars.color.foregroundMuted} l c h / 0.28) 0%, transparent 70%)`,
		pointerEvents: 'none',
		zIndex: 0,
	}),

	content: style({
		minHeight: '100%',
	}),

	topRow: style({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	}),

	timestamp: style({
		fontSize: vars.text.xxs,
		color: vars.color.foregroundMuted,
		letterSpacing: '0.03em',
	}),

	heroRow: style({
		display: 'flex',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		gap: vars.spacing[4],
	}),

	tempBlock: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[1],
	}),

	temperature: style({
		fontSize: vars.text['5xl'],
		fontWeight: 800,
		lineHeight: 1,
		letterSpacing: '-0.04em',
		fontVariantNumeric: 'tabular-nums',
		color: vars.color.foreground,
		display: 'flex',
		alignItems: 'center',
		gap: vars.spacing[3],
	}),

	condition: style({
		fontSize: vars.text.sm,
		color: vars.color.foregroundMuted,
		fontWeight: 400,
		letterSpacing: '0.01em',
	}),

	weatherIcon: style({
		width: '2.25rem',
		height: '2.25rem',
		color: vars.color.foregroundMuted,
		strokeWidth: 1.5,
	}),

	feelsChip: style({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		gap: vars.spacing['0.5'],
	}),

	feelsLabel: style({
		fontSize: vars.text.xxs,
		color: vars.color.foregroundMuted,
		textTransform: 'uppercase',
		letterSpacing: '0.1em',
		fontWeight: 600,
	}),

	feelsValue: style({
		fontSize: vars.text['2xl'],
		fontWeight: 700,
		fontVariantNumeric: 'tabular-nums',
		color: vars.color.foregroundAlt,
		lineHeight: 1,
	}),

	statsRow: style({
		padding: 0,
	}),
}
