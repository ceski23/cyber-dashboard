import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { mapValues } from 'es-toolkit'

export const styles = {
	root: style({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'stretch',
		gap: 0,
		borderRadius: vars.radius.xl,
		border: `1px solid ${vars.color.borderSubtle}`,
		background: vars.color.panel,
		color: vars.color.foreground,
		overflow: 'hidden',
	}),

	scoreBlock: recipe({
		base: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: vars.spacing['0.5'],
			paddingInline: vars.spacing[5],
			paddingBlock: vars.spacing[4],
			borderRight: `1px solid ${vars.color.borderSubtle}`,
			flexShrink: 0,
		},
		variants: {
			tier: mapValues(vars.color.aqi, color => ({
				color: color,
				background: transparentize(color, 0.08),
			})),
		},
	}),

	aqiScore: style({
		fontSize: vars.text['3xl'],
		fontWeight: 700,
		lineHeight: 1,
		fontVariantNumeric: 'tabular-nums',
	}),

	aqiLabel: style({
		fontSize: vars.text.xs,
		fontWeight: 500,
	}),

	infoBlock: style({
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		gap: vars.spacing[3],
		paddingInline: vars.spacing[4],
		paddingBlock: vars.spacing[3],
		flex: 1,
		minWidth: 0,
	}),

	topRow: style({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: vars.spacing[2],
	}),

	header: style({
		fontSize: vars.text.xs,
		fontWeight: 600,
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
		color: vars.color.foregroundMuted,
	}),

	timestamp: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
	}),

	metricsRow: style({
		display: 'flex',
		flexDirection: 'row',
		gap: vars.spacing[5],
	}),

	metricItem: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing['0.5'],
	}),

	metricLabel: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		textTransform: 'uppercase',
		letterSpacing: '0.06em',
		fontWeight: 500,
	}),

	metricValue: style({
		fontSize: vars.text.sm,
		fontWeight: 600,
		color: vars.color.foreground,
		fontVariantNumeric: 'tabular-nums',
	}),
}
