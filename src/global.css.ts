import { globalStyle } from '@vanilla-extract/css'

import { transparentize } from './lib/utils/style'
import { vars } from './theme.css'

globalStyle('html, body', {
	display: 'flex',
	flexDirection: 'column',
	margin: 0,
	width: '100%',
	fontFamily: vars.font.sans,
	color: vars.color.foreground,
	background: `radial-gradient(circle, ${transparentize(vars.color.white, 0.05)} 1px, transparent 1px) 0 0 / 24px 24px repeat`,
	backgroundColor: vars.color.background,
})

globalStyle('::selection', {
	background: transparentize(vars.color.primary, 0.5),
	color: vars.color.foreground,
})
