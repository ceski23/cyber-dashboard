import { style } from '@vanilla-extract/css'

import { transparentize } from '@/lib/utils/style'
import { vars } from '@/theme.css'

export const errorRoot = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	fontSize: vars.text.sm,
	paddingInline: vars.spacing[2],
	paddingBlock: vars.spacing[1.5],
	borderRadius: vars.radius.md,
	border: `1px solid ${transparentize(vars.color.danger, 0.1)}`,
	backgroundColor: transparentize(vars.color.danger, 0.05),
	color: vars.color.dangerForeground,
})
