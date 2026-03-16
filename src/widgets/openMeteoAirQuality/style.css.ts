import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { mapValues } from 'es-toolkit'

export const styles = {
	root: style({
		minHeight: vars.spacing[48],
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
}
