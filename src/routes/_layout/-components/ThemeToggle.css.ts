import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const button = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '32px',
	height: '32px',
	borderRadius: vars.radius.lg,
	border: `1px solid ${vars.color.border}`,
	backgroundColor: 'transparent',
	color: vars.color.foregroundMuted,
	cursor: 'pointer',
	transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
	flexShrink: 0,
	padding: 0,
	':hover': {
		backgroundColor: vars.color.backgroundAlt,
		color: vars.color.foreground,
		borderColor: vars.color.border,
	},
})
