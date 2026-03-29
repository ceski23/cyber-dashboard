import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { createGlobalVar, globalStyle, keyframes, style } from '@vanilla-extract/css'

const shimmerX = createGlobalVar('shimmer-x', {
	syntax: '<length>',
	inherits: true,
	initialValue: '0px',
})

const shimmerAnim = keyframes({
	'0%': { vars: { [shimmerX]: '-150vw' } },
	'100%': { vars: { [shimmerX]: '50vw' } },
})

globalStyle(':root', {
	animation: `${shimmerAnim} 2s linear infinite`,
	'@media': {
		'(prefers-reduced-motion: reduce)': {
			animationPlayState: 'paused',
		},
	},
})

export const skeleton = style({
	display: 'block',
	borderRadius: vars.radius.lg,
	backgroundColor: transparentize(vars.color.backgroundAlt, 0.5),
	backgroundImage: `linear-gradient(90deg, transparent 25%, light-dark(${transparentize(vars.color.black, 0.08)}, ${transparentize(vars.color.white, 0.12)}) 50%, transparent 75%)`,
	backgroundSize: '200vw 100%',
	backgroundAttachment: 'fixed',
	backgroundPosition: `${shimmerX} center`,
	backgroundRepeat: 'no-repeat',
})
