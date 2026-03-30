import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const spin = keyframes({
	from: { transform: 'rotate(0deg)' },
	to: { transform: 'rotate(360deg)' },
})

export const styles = {
	root: style({
		display: 'flex',
		flexDirection: 'column',
		maxHeight: 312,
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
				warning: {
					background: `radial-gradient(ellipse at 100% 0%, ${transparentize(vars.color.warning, 0.12)} 0%, transparent 65%)`,
				},
				ok: {
					background: 'none',
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

	refreshButton: style({
		color: vars.color.foregroundMuted,
		':hover': {
			color: vars.color.foreground,
		},
	}),

	refreshIcon: recipe({
		base: {},
		variants: {
			loading: {
				true: { animation: `${spin} 1s linear infinite` },
				false: {},
			},
		},
	}),

	statsRow: style({
		flexShrink: 0,
		borderBottom: `1px solid ${vars.color.borderSubtle}`,
	}),

	imageRef: recipe({
		base: {
			fontSize: vars.text.sm,
			fontWeight: 500,
			color: vars.color.foreground,
			flex: 1,
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		},
		variants: {
			withLink: {
				true: {
					textDecoration: 'none',
					':hover': {
						textDecoration: 'underline',
					},
				},
			},
		},
	}),

	updateBadge: recipe({
		base: {
			fontSize: vars.text.xxs,
			fontWeight: 600,
			paddingBlock: vars.spacing['0.5'],
			paddingInline: vars.spacing[2],
			borderRadius: vars.radius.full,
			flexShrink: 0,
			letterSpacing: '0.04em',
			textTransform: 'uppercase',
		},
		variants: {
			type: {
				major: {
					color: vars.color.error,
					background: transparentize(vars.color.error, 0.15),
				},
				minor: {
					color: vars.color.warning,
					background: transparentize(vars.color.warning, 0.15),
				},
				patch: {
					color: vars.color.success,
					background: transparentize(vars.color.success, 0.15),
				},
				digest: {
					color: vars.color.foregroundMuted,
					background: transparentize(vars.color.foreground, 0.08),
				},
				other: {
					color: vars.color.foregroundMuted,
					background: transparentize(vars.color.foreground, 0.08),
				},
			},
		},
	}),

	newTag: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		fontVariantNumeric: 'tabular-nums',
		flexShrink: 0,
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
				upToDate: {
					backgroundColor: vars.color.success,
					boxShadow: `0 0 4px ${transparentize(vars.color.success, 0.6)}`,
				},
				update: {
					backgroundColor: vars.color.warning,
					boxShadow: `0 0 4px ${transparentize(vars.color.warning, 0.6)}`,
				},
				unknown: {
					backgroundColor: vars.color.foregroundMuted,
				},
				error: {
					backgroundColor: vars.color.error,
					boxShadow: `0 0 4px ${transparentize(vars.color.error, 0.6)}`,
				},
			},
		},
	}),

	empty: style({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
	}),
}
