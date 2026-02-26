import { getVarName } from '#lib/utils/style'
import { createVar, style } from '@vanilla-extract/css'

export const memoryVar = createVar({
	syntax: '<integer>',
	initialValue: '0',
	inherits: false,
})

export const styles = {
	value: style({
		transition: `${getVarName(memoryVar)} 1s ease-out`,
		counterReset: `memory ${memoryVar}`,
		'::after': {
			content: 'counter(memory) " %"',
		},
	}),
}
