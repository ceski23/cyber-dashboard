import { vars } from '#theme.css'
import { keyframes, style } from '@vanilla-extract/css'

const fadeDepth = vars.spacing[8]
const edgeMask = `linear-gradient(to bottom, transparent, ${vars.color.black} ${fadeDepth}), linear-gradient(to top, transparent, ${vars.color.black} ${fadeDepth})`

const scrollFade = keyframes({
	'0%': {
		maskImage: edgeMask,
		maskPosition: `0 calc(-1 * ${fadeDepth}), 0 calc(-1 * ${fadeDepth})`,
	},
	'5%, 95%': { maskImage: edgeMask, maskPosition: `0 0, 0 calc(-1 * ${fadeDepth})` },
	'100%': { maskImage: edgeMask, maskPosition: '0 0, 0 0' },
})

export const root = style({
	flex: 1,
	minHeight: 0,
	overflowY: 'auto',
	paddingBlock: vars.spacing[1],
	'@supports': {
		'(animation-timeline: scroll(self)) and (mask-composite: intersect)': {
			maskSize: `100% calc(100% + ${fadeDepth})`,
			maskRepeat: 'no-repeat',
			maskComposite: 'intersect',
			animationName: scrollFade,
			animationDuration: 'auto',
			animationTimingFunction: 'linear',
			animationTimeline: 'scroll(self block)',
		},
	},
})

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: vars.spacing[3],
	paddingBlock: vars.spacing[1.5],
	paddingInline: vars.spacing[4],
})
