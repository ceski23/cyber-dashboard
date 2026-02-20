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
	backgroundColor: vars.color.background,
	background: 'radial-gradient(ellipse at top, #18181b 0%, #000000 55%, #000000 100%)',
})

globalStyle('::selection', {
	background: transparentize(vars.color.primary, 0.5),
	color: vars.color.foreground,
})
