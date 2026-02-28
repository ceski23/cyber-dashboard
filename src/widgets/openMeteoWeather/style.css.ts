import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const styles = {
	root: style({
		borderRadius: vars.radius['2xl'],
		border: `1px solid ${transparentize(vars.color.white, 0.08)}`,
		background: 'oklch(0.22 0.008 286 / 60%)',
		backdropFilter: 'blur(20px)',
		WebkitBackdropFilter: 'blur(20px)',
		boxShadow: `inset 0 1px 0 ${transparentize(vars.color.white, 0.07)}, 0 8px 32px ${transparentize(vars.color.black, 0.4)}`,
		color: vars.color.foreground,
		overflow: 'hidden',
		padding: vars.spacing[5],
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[4],
		boxSizing: 'border-box',
		position: 'relative',
	}),

	glow: style({
		position: 'absolute',
		top: 0,
		right: 0,
		width: '70%',
		height: '100%',
		background: `radial-gradient(ellipse at 100% 0%, oklch(from ${vars.color.primary} l c h / 0.28) 0%, transparent 70%)`,
		pointerEvents: 'none',
		zIndex: 0,
	}),

	content: style({
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[4],
	}),

	topRow: style({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	}),

	widgetLabel: style({
		fontSize: vars.text.xxs,
		fontWeight: 700,
		letterSpacing: '0.12em',
		textTransform: 'uppercase',
		color: vars.color.foregroundMuted,
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
	}),

	condition: style({
		fontSize: vars.text.sm,
		color: vars.color.foregroundMuted,
		fontWeight: 400,
		letterSpacing: '0.01em',
	}),

	feelsChip: style({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		gap: vars.spacing['0.5'],
		paddingBottom: vars.spacing[1],
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

	divider: style({
		height: '1px',
		background: transparentize(vars.color.white, 0.06),
	}),

	statsRow: style({
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gap: vars.spacing[2],
	}),

	statItem: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing['0.5'],
		padding: `${vars.spacing[2]} ${vars.spacing[3]}`,
		background: transparentize(vars.color.white, 0.03),
		borderRadius: vars.radius.lg,
		border: `1px solid ${transparentize(vars.color.white, 0.05)}`,
	}),

	statValue: style({
		fontSize: vars.text.sm,
		fontWeight: 600,
		color: vars.color.foreground,
		fontVariantNumeric: 'tabular-nums',
	}),

	statLabel: style({
		fontSize: vars.text.xxs,
		color: vars.color.foregroundMuted,
		textTransform: 'uppercase',
		letterSpacing: '0.07em',
		fontWeight: 500,
	}),
}
