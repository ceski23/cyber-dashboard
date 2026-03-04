import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { mapValues } from 'es-toolkit'

export const styles = {
	root: recipe({
		base: {
			borderRadius: vars.radius['2xl'],
			border: `1px solid ${transparentize(vars.color.white, 0.08)}`,
			background: vars.color.panel,
			backdropFilter: 'blur(20px)',
			color: vars.color.foreground,
			overflow: 'hidden',
			padding: vars.spacing[5],
			display: 'flex',
			flexDirection: 'column',
			gap: vars.spacing[4],
			boxSizing: 'border-box',
			position: 'relative',
		},
		variants: { tier: mapValues(vars.color.aqi, () => ({})) },
	}),

	glow: recipe({
		base: {
			position: 'absolute',
			top: 0,
			right: 0,
			width: '100%',
			height: '100%',
			pointerEvents: 'none',
			zIndex: 0,
			transition: 'background 0.4s ease',
		},
		variants: {
			tier: mapValues(vars.color.aqi, color => ({
				background: `radial-gradient(ellipse at 0% 0%, ${transparentize(color, 0.2)} 0%, transparent 70%)`,
			})),
		},
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

	aqiBlock: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[1],
	}),

	aqiScore: recipe({
		base: {
			fontSize: vars.text['5xl'],
			fontWeight: 800,
			lineHeight: 1,
			letterSpacing: '-0.04em',
			fontVariantNumeric: 'tabular-nums',
			transition: 'color 0.4s ease',
		},
		variants: {
			tier: mapValues(vars.color.aqi, color => ({ color })),
		},
	}),

	aqiLabel: style({
		fontSize: vars.text.sm,
		color: vars.color.foregroundMuted,
		fontWeight: 400,
		letterSpacing: '0.01em',
	}),

	pm25Chip: style({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		gap: vars.spacing['0.5'],
		paddingBottom: vars.spacing[1],
	}),

	pm25ChipLabel: style({
		fontSize: vars.text.xxs,
		color: vars.color.foregroundMuted,
		textTransform: 'uppercase',
		letterSpacing: '0.1em',
		fontWeight: 600,
	}),

	pm25ChipValue: style({
		fontSize: vars.text['2xl'],
		fontWeight: 700,
		fontVariantNumeric: 'tabular-nums',
		color: vars.color.foregroundAlt,
		lineHeight: 1,
	}),

	pm25ChipUnit: style({
		fontSize: vars.text.xxs,
		color: vars.color.foregroundMuted,
		fontWeight: 400,
	}),

	divider: style({
		height: '1px',
		background: transparentize(vars.color.white, 0.06),
	}),

	statsRow: style({
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
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
