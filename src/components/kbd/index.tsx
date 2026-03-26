import type { RecipeVariants } from '@vanilla-extract/recipes'
import type { ComponentProps, FunctionComponent } from 'react'
import { style } from './style.css'

type KbdProps = ComponentProps<'kbd'> & RecipeVariants<typeof style>

export const Kbd: FunctionComponent<KbdProps> = ({ className, variant, ...props }) => (
	<kbd
		className={[className, style({ variant })]}
		{...props}
	/>
)
