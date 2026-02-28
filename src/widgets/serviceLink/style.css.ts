import { getVarName } from '#lib/utils/style'
import { vars } from '#theme.css'
import { createVar, keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const pulse = keyframes({
	'0%': { opacity: 0.4 },
	'50%': { opacity: 1 },
	'100%': { opacity: 0.4 },
})

const gradientStartVar = createVar({
	syntax: '<percentage>',
	initialValue: '100%',
	inherits: false,
})

export const styles = {
	root: recipe({
		base: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			gap: vars.spacing[4],
			paddingInline: vars.spacing[5],
			paddingBlock: vars.spacing[3],
			borderRadius: vars.radius.xl,
			border: `1px solid ${vars.color.borderSubtle}`,
			background: vars.color.panel,
			backdropFilter: 'blur(10px)',
			textDecoration: 'none',
			color: vars.color.foreground,
			height: vars.spacing['18'],
			cursor: 'pointer',
			transition: `border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease, background 0.4s ease, ${getVarName(gradientStartVar)} 0.5s ease`,
			':hover': {
				borderColor: vars.color.border,
				transform: 'translateY(-2px)',
				boxShadow: vars.shadow.panel,
			},
		},
		variants: {
			status: {
				available: {
					background: `linear-gradient(to right, transparent ${gradientStartVar}, oklch(from oklch(0.72 0.18 142) l c h / 0.1)), ${vars.color.panel}`,
					[getVarName(gradientStartVar)]: '60%',
				},
				unavailable: {
					background: `linear-gradient(to right, transparent ${gradientStartVar}, oklch(from oklch(0.65 0.22 25) l c h / 0.1)), ${vars.color.panel}`,
					[getVarName(gradientStartVar)]: '60%',
				},
			},
		},
	}),

	icon: style({
		width: '32px',
		height: '32px',
		borderRadius: vars.radius.md,
		objectFit: 'contain',
		flexShrink: 0,
	}),

	meta: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing['0.5'],
		width: 0,
		flex: 1,
	}),

	name: style({
		fontSize: vars.text.sm,
		fontWeight: 600,
		color: vars.color.foreground,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	}),

	description: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	}),

	tooltipPopup: style({
		background: vars.color.backgroundAlt,
		color: vars.color.foreground,
		border: `1px solid ${vars.color.border}`,
		borderRadius: vars.radius.md,
		paddingBlock: vars.spacing[1],
		paddingInline: vars.spacing[2],
		fontSize: vars.text.xs,
		whiteSpace: 'nowrap',
		boxShadow: vars.shadow.panel,
		'@media': {
			'(prefers-reduced-motion: no-preference)': {
				transition: 'opacity 0.2s ease, transform 0.2s ease',
				selectors: {
					'&:is([data-starting-style], [data-ending-style])': { opacity: 0 },
					'&:is([data-starting-style], [data-ending-style])[data-side="top"]': {
						transform: 'translateY(8px)',
					},
					'&:is([data-starting-style], [data-ending-style])[data-side="bottom"]': {
						transform: 'translateY(-8px)',
					},
					'&:is([data-starting-style], [data-ending-style])[data-side="left"]': {
						transform: 'translateX(8px)',
					},
					'&:is([data-starting-style], [data-ending-style])[data-side="right"]': {
						transform: 'translateX(-8px)',
					},
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
			position: 'relative',
			'::before': {
				content: '""',
				display: 'block',
				position: 'absolute',
				inset: -8,
			},
		},
		variants: {
			status: {
				available: {
					backgroundColor: 'oklch(0.72 0.18 142)',
					boxShadow: '0 0 5px oklch(0.72 0.18 142 / 60%)',
				},
				unavailable: {
					backgroundColor: 'oklch(0.65 0.22 25)',
					boxShadow: '0 0 5px oklch(0.65 0.22 25 / 60%)',
				},
				pending: {
					backgroundColor: vars.color.foregroundMuted,
					animation: `${pulse} 1.5s ease-in-out infinite`,
				},
				unknown: {
					backgroundColor: vars.color.foregroundMuted,
				},
			},
		},
	}),
}
