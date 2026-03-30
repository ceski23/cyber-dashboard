import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const root = style({
	display: 'grid',
	gap: vars.spacing[2],
	padding: vars.spacing[3],
})

export const item = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.spacing['0.5'],
	padding: `${vars.spacing[2]} ${vars.spacing[3]}`,
	background: transparentize(vars.color.white, 0.03),
	borderRadius: vars.radius.lg,
	border: `1px solid ${transparentize(vars.color.white, 0.05)}`,
})

export const value = style({
	fontSize: vars.text.sm,
	fontWeight: 600,
	color: vars.color.foreground,
	fontVariantNumeric: 'tabular-nums',
})

export const label = style({
	fontSize: vars.text.xxs,
	color: vars.color.foregroundMuted,
	textTransform: 'uppercase',
	letterSpacing: '0.07em',
	fontWeight: 500,
})
