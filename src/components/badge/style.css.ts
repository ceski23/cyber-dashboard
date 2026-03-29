import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const badge = recipe({
	base: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: vars.spacing[1.5],
		fontSize: vars.text.xxs,
		fontWeight: 600,
		letterSpacing: '0.06em',
		textTransform: 'uppercase',
		paddingBlock: vars.spacing[0.5],
		paddingInline: vars.spacing[2],
		borderRadius: vars.radius.full,
		border: '1px solid',
		flexShrink: 0,
	},
	variants: {
		variant: {
			success: {
				color: vars.color.success,
				borderColor: transparentize(vars.color.success, 0.35),
				background: transparentize(vars.color.success, 0.08),
			},
			warning: {
				color: vars.color.warning,
				borderColor: transparentize(vars.color.warning, 0.35),
				background: transparentize(vars.color.warning, 0.08),
			},
			error: {
				color: vars.color.error,
				borderColor: transparentize(vars.color.error, 0.35),
				background: transparentize(vars.color.error, 0.08),
			},
			neutral: {
				color: vars.color.foregroundMuted,
				borderColor: transparentize(vars.color.white, 0.1),
				background: 'transparent',
			},
		},
	},
})

export const dot = style({
	display: 'block',
	width: '6px',
	height: '6px',
	borderRadius: vars.radius.full,
	background: 'currentColor',
	boxShadow: '0 0 4px currentColor',
	flexShrink: 0,
})
