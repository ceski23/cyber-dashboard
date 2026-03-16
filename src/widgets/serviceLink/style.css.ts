import { getVarName, transparentize } from '#lib/utils/style'
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
			textDecoration: 'none',
			color: vars.color.foreground,
			height: vars.spacing['18'],
			transition: `background 0.4s ease, ${getVarName(gradientStartVar)} 0.5s ease`,
		},
		variants: {
			status: {
				available: {
					background: `linear-gradient(to right, transparent ${gradientStartVar}, ${transparentize(vars.color.success, 0.1)}), ${vars.color.panel}`,
					[getVarName(gradientStartVar)]: '60%',
				},
				unavailable: {
					background: `linear-gradient(to right, transparent ${gradientStartVar}, ${transparentize(vars.color.error, 0.1)}), ${vars.color.panel}`,
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
					backgroundColor: vars.color.success,
					boxShadow: `0 0 5px ${transparentize(vars.color.success, 0.6)}`,
				},
				unavailable: {
					backgroundColor: vars.color.error,
					boxShadow: `0 0 5px ${transparentize(vars.color.error, 0.6)}`,
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
