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

	statsRow: style({
		borderBottom: `1px solid ${vars.color.borderSubtle}`,
		flexShrink: 0,
	}),

	rowLink: style({
		fontSize: vars.text.sm,
		fontWeight: 500,
		color: vars.color.foreground,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		textDecoration: 'none',
		flexShrink: 1,
		minWidth: 0,
		':hover': {
			textDecoration: 'underline',
		},
	}),

	tagList: style({
		display: 'flex',
		alignItems: 'center',
		gap: vars.spacing[1],
		flexShrink: 0,
		marginInline: vars.spacing[2],
		overflow: 'hidden',
	}),

	deviceMeta: style({
		fontSize: vars.text.xs,
		fontWeight: 400,
		color: vars.color.foregroundMuted,
		fontVariantNumeric: 'tabular-nums',
		flexShrink: 0,
		marginLeft: 'auto',
	}),

	tagBadge: style({
		fontSize: vars.text.xxs,
		fontWeight: 500,
		color: vars.color.foregroundMuted,
		background: vars.color.backgroundAlt,
		paddingBlock: '1px',
		paddingInline: vars.spacing[1],
		borderRadius: vars.radius.sm,
		whiteSpace: 'nowrap',
		textTransform: 'uppercase',
		letterSpacing: '0.02em',
		lineHeight: 1.4,
	}),

	statusDot: recipe({
		base: {
			display: 'block',
			width: 8,
			height: 8,
			borderRadius: vars.radius.full,
			flexShrink: 0,
		},
		variants: {
			connected: {
				true: {
					backgroundColor: vars.color.success,
					boxShadow: `0 0 4px ${transparentize(vars.color.success, 0.6)}`,
				},
				false: {
					backgroundColor: vars.color.error,
					boxShadow: `0 0 4px ${transparentize(vars.color.error, 0.6)}`,
				},
			},
		},
	}),
}
