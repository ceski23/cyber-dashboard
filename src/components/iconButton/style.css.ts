import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const root = style({
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
})
