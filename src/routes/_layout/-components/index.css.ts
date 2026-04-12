import { media, vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const page = style({
	padding: vars.spacing[6],
})

export const grid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(6, 1fr)',
	gap: vars.spacing[4],
	alignItems: 'start',
	'@media': {
		[media.lg]: {
			gridTemplateColumns: 'repeat(12, 1fr)',
		},
	},
})

export const group = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.spacing[3],
})

export const stack = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.spacing[4],
})

export const groupHeader = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.spacing[2],
	marginTop: vars.spacing[4],
})

export const groupLabel = style({
	fontSize: vars.text.xs,
	fontWeight: 600,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: vars.color.foregroundMuted,
	userSelect: 'none',
})

export const groupRule = style({
	flex: 1,
	height: '1px',
	background: vars.color.borderSubtle,
})

export const groupWidgets = style({
	display: 'grid',
	gap: vars.spacing[4],
	alignItems: 'start',
})
