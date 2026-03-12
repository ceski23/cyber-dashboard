import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const tooltipPopup = style({
	background: vars.color.backgroundAlt,
	color: vars.color.foreground,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.md,
	paddingBlock: vars.spacing[1],
	paddingInline: vars.spacing[2],
	fontSize: vars.text.xs,
	boxShadow: vars.shadow.panel,
	'@media': {
		'(prefers-reduced-motion: no-preference)': {
			transition: 'opacity 0.2s ease, transform 0.2s ease',
			selectors: {
				'&:is([data-starting-style], [data-ending-style])': { opacity: 0 },
				'&:is([data-starting-style], [data-ending-style])[data-side="top"]': {
					transform: 'translateY(8px)',
				},
				'&:is([data-starting-style], [data-ending-style])[data-side="bottom"]': {
					transform: 'translateY(-8px)',
				},
				'&:is([data-starting-style], [data-ending-style])[data-side="left"]': {
					transform: 'translateX(8px)',
				},
				'&:is([data-starting-style], [data-ending-style])[data-side="right"]': {
					transform: 'translateX(-8px)',
				},
			},
		},
	},
})
