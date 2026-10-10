import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { styles as cupStyles } from '../cup/style.css'

export const updateDetails = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.spacing[3],
	flex: '0 1 auto',
	minWidth: 0,
	maxWidth: '50%',
})

export const updateValue = style([
	cupStyles.newTag,
	{
		flexShrink: 1,
		minWidth: 0,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		textAlign: 'right',
	},
])

export const updateBadge = style({
	boxSizing: 'border-box',
	textAlign: 'center',
	flexShrink: 0,
})
