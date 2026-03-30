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
				success: {
					background: `radial-gradient(ellipse at 100% 0%, ${transparentize(vars.color.success, 0.12)} 0%, transparent 65%)`,
				},
				warning: {
					background: `radial-gradient(ellipse at 100% 0%, ${transparentize(vars.color.warning, 0.12)} 0%, transparent 65%)`,
				},
				error: {
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

	rowLink: style({
		fontSize: vars.text.sm,
		fontWeight: 500,
		color: vars.color.foreground,
		flex: 1,
		textDecoration: 'none',
		':hover': {
			textDecoration: 'underline',
		},
	}),

	rowTotal: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		fontVariantNumeric: 'tabular-nums',
		flexShrink: 0,
	}),

	countPill: recipe({
		base: {
			fontSize: vars.text.xxs,
			fontWeight: 600,
			paddingBlock: vars.spacing[1],
			paddingInline: vars.spacing[1.5],
			borderRadius: vars.radius.full,
			flexShrink: 0,
			fontVariantNumeric: 'tabular-nums',
			display: 'flex',
			alignItems: 'center',
			lineHeight: 1,
			gap: vars.spacing[1],
		},
		variants: {
			tone: {
				warning: {
					color: vars.color.warning,
					background: transparentize(vars.color.warning, 0.15),
				},
				error: {
					color: vars.color.error,
					background: transparentize(vars.color.error, 0.15),
				},
			},
		},
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
			status: {
				ok: {
					backgroundColor: vars.color.success,
					boxShadow: `0 0 4px ${transparentize(vars.color.success, 0.6)}`,
				},
				warning: {
					backgroundColor: vars.color.warning,
					boxShadow: `0 0 4px ${transparentize(vars.color.warning, 0.6)}`,
				},
				error: {
					backgroundColor: vars.color.error,
					boxShadow: `0 0 4px ${transparentize(vars.color.error, 0.6)}`,
				},
			},
		},
	}),

	statsRow: style({
		borderBottom: `1px solid ${vars.color.borderSubtle}`,
		flexShrink: 0,
	}),

	skeletonStatItem: style({
		borderRadius: vars.radius.lg,
	}),
}
