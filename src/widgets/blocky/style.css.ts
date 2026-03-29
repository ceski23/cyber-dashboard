import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const styles = {
	root: style({
		display: 'flex',
		flexDirection: 'column',
	}),

	glow: recipe({
		base: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			pointerEvents: 'none',
			zIndex: 0,
			transition: 'background 0.6s ease',
		},
		variants: {
			status: {
				enabled: {
					background: `radial-gradient(ellipse at 100% 0%, ${transparentize(vars.color.success, 0.12)} 0%, transparent 65%)`,
				},
				disabled: {
					background: `radial-gradient(ellipse at 100% 0%, ${transparentize(vars.color.error, 0.1)} 0%, transparent 65%)`,
				},
				loading: {
					background: 'none',
				},
			},
		},
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

	headerActions: style({
		display: 'flex',
		alignItems: 'center',
		gap: vars.spacing[2],
		marginLeft: 'auto',
	}),

	toggleButton: recipe({
		base: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: vars.spacing[1],
			minWidth: '28px',
			height: '28px',
			paddingInline: vars.spacing[1],
			borderRadius: vars.radius.md,
			border: 'none',
			cursor: 'pointer',
			flexShrink: 0,
			background: 'transparent',
			transition: 'color 0.2s ease, background 0.2s ease, opacity 0.2s ease',
			':hover': {
				background: transparentize(vars.color.white, 0.06),
			},
			selectors: {
				'&:disabled': {
					opacity: 0.4,
					cursor: 'not-allowed',
				},
			},
		},
		variants: {
			enabled: {
				true: {
					color: vars.color.success,
				},
				false: {
					color: vars.color.error,
				},
			},
		},
	}),

	timerText: style({
		fontSize: vars.text.xxs,
		fontWeight: 500,
		fontVariantNumeric: 'tabular-nums',
		lineHeight: 1,
	}),

	statsRow: style({
		gridTemplateColumns: 'repeat(3, 1fr)',
		padding: vars.spacing[3],
		flex: 1,
		alignContent: 'end',
	}),

	tooltipGroups: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[2],
		minWidth: '148px',
	}),

	tooltipTitle: style({
		fontSize: vars.text.xxs,
		fontWeight: 600,
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
		color: vars.color.foregroundMuted,
	}),

	tooltipGroupList: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[1],
	}),

	tooltipGroup: style({
		display: 'flex',
		alignItems: 'center',
		gap: vars.spacing[2],
		fontSize: vars.text.xs,
		color: vars.color.foreground,
	}),

	tooltipGroupDot: style({
		width: '4px',
		height: '4px',
		borderRadius: vars.radius.full,
		backgroundColor: vars.color.error,
		flexShrink: 0,
	}),
}
