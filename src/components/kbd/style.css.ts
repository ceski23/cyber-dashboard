import { recipe } from '@vanilla-extract/recipes'

import { transparentize } from '@/lib/utils/style'
import { vars } from '@/theme.css'

export const style = recipe({
	base: {
		pointerEvents: 'none',
		display: 'inline-flex',
		fontSize: vars.text.xs,
		fontWeight: 500,
		fontFamily: vars.font.sans,
		borderRadius: vars.radius.md,
		border: `1px solid ${vars.color.borderSubtle}`,
		paddingInline: vars.spacing['1.5'],
		paddingBlock: vars.spacing['0.5'],
	},
	variants: {
		variant: {
			dark: {
				color: vars.color.foregroundMuted,
				backgroundColor: transparentize(vars.color.background, 0.4),
			},
			light: {
				color: vars.color.foregroundMuted,
				backgroundColor: vars.color.backgroundAlt,
			},
		},
	},
})
