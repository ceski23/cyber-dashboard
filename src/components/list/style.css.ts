import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const root = style({
	flex: 1,
	overflowY: 'auto',
	paddingBlock: vars.spacing[1],
})

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: vars.spacing[3],
	paddingBlock: vars.spacing[1.5],
	paddingInline: vars.spacing[4],
})
