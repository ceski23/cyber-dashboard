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
		paddingInline: vars.spacing[5],
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
		flex: 1,
		alignContent: 'center',
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
				loading: {
					background: 'none',
				},
				success: {
					background: `radial-gradient(ellipse at 100% 0%, ${transparentize(vars.color.success, 0.08)} 0%, transparent 65%)`,
				},
				error: {
					background: `radial-gradient(ellipse at 100% 0%, ${transparentize(vars.color.error, 0.1)} 0%, transparent 65%)`,
				},
			},
		},
	}),
}
