import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const styles = {
	root: style({
		display: 'flex',
		flexDirection: 'column',
	}),

	header: style({
		paddingBlock: vars.spacing[3],
		paddingInline: vars.spacing[4],
		gap: vars.spacing[2],
		flexShrink: 0,
		borderBottom: `1px solid ${vars.color.borderSubtle}`,
	}),

	icon: style({
		width: '18px',
		height: '18px',
		objectFit: 'contain',
		flexShrink: 0,
	}),

	metrics: recipe({
		base: {
			display: 'grid',
			gridTemplateColumns: 'auto 1fr auto',
			columnGap: vars.spacing[3],
			alignItems: 'center',
			padding: `${vars.spacing[3]} ${vars.spacing[4]}`,
			borderBottom: `1px solid ${vars.color.borderSubtle}`,
		},
		variants: {
			status: {
				pending: {
					rowGap: vars.spacing[3],
					padding: `${vars.spacing[4]} ${vars.spacing[4]}`,
				},
				success: {
					rowGap: vars.spacing[2],
					padding: `${vars.spacing[3]} ${vars.spacing[4]}`,
				},
			},
		},
	}),

	metricLabel: style({
		fontSize: vars.text.xxs,
		fontWeight: 600,
		color: vars.color.foregroundMuted,
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
		width: '2rem',
		flexShrink: 0,
	}),

	progressTrack: style({
		height: '6px',
		borderRadius: vars.radius.full,
		background: transparentize(vars.color.white, 0.06),
		overflow: 'hidden',
	}),

	progressBar: recipe({
		base: {
			height: '100%',
			borderRadius: vars.radius.full,
			transition: 'width 0.4s ease',
		},
		variants: {
			variant: {
				ok: {
					background: vars.color.success,
				},
				warning: {
					background: vars.color.warning,
				},
				error: {
					background: vars.color.error,
				},
			},
		},
	}),

	metricValue: recipe({
		base: {
			fontSize: vars.text.xs,
			fontWeight: 600,
			fontVariantNumeric: 'tabular-nums',
			textAlign: 'right',
		},
		variants: {
			variant: {
				ok: { color: vars.color.foreground },
				warning: { color: vars.color.warning },
				error: { color: vars.color.error },
			},
		},
	}),

	metricValueMeta: style({
		fontWeight: 400,
		color: vars.color.foregroundMuted,
	}),
}
