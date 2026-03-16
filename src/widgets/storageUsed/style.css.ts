import { getVarName, transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { createVar, style } from '@vanilla-extract/css'

export const storageVar = createVar({
	syntax: '<integer>',
	initialValue: '0',
	inherits: false,
})

export const styles = {
	root: style({
		height: vars.spacing[32],
	}),

	content: style({
		height: '100%',
		justifyContent: 'space-between',
	}),

	meta: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		fontVariantNumeric: 'tabular-nums',
		flexShrink: 0,
	}),

	bottom: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[2],
	}),

	value: style({
		transition: `${getVarName(storageVar)} 1s ease-out`,
		counterReset: `storage ${storageVar}`,
		fontSize: vars.text['4xl'],
		fontWeight: 700,
		color: vars.color.foreground,
		lineHeight: 1,
		position: 'relative',
		marginRight: 'auto',
		'::before': {
			content: 'counter(storage)',
		},
		'::after': {
			content: '%',
			position: 'absolute',
			transform: 'translateX(100%)',
			right: 0,
			bottom: 0,
			top: 0,
			paddingLeft: vars.spacing[1],
			display: 'flex',
			alignItems: 'flex-end',
			opacity: 0.5,
			fontSize: vars.text['2xl'],
			fontWeight: 700,
			color: vars.color.foreground,
		},
	}),

	progressTrack: style({
		height: '4px',
		borderRadius: vars.radius.full,
		background: transparentize(vars.color.foreground, 0.1),
		overflow: 'hidden',
	}),

	progressBar: style({
		height: '100%',
		borderRadius: vars.radius.full,
		background: 'currentColor',
		transition: 'width 0.5s ease-out',
	}),
}
