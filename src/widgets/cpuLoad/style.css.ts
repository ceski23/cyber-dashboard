import { getVarName } from '#lib/utils/style'
import { createVar, style } from '@vanilla-extract/css'

export const loadVar = createVar({
	syntax: '<integer>',
	initialValue: '0',
	inherits: false,
})

export const styles = {
	value: style({
		transition: `${getVarName(loadVar)} 1s ease-out`,
		counterReset: `load ${loadVar}`,
		'::after': {
			content: 'counter(load) " %"',
		},
	}),
}
