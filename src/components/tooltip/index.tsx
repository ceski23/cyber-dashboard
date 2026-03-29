import { Tooltip } from '@base-ui/react/tooltip'
import type { FunctionComponent, ReactElement, ReactNode } from 'react'
import { tooltipPopup } from './style.css'

type Props = {
	content: ReactNode
	children: ReactElement
	delay?: number
	side?: 'top' | 'bottom' | 'left' | 'right'
	sideOffset?: number
	align?: 'start' | 'center' | 'end'
}

export const StyledTooltip: FunctionComponent<Props> = ({
	content,
	children,
	delay = 100,
	side = 'top',
	sideOffset = 8,
	align = 'center',
}) => (
	<Tooltip.Root>
		<Tooltip.Trigger
			delay={delay}
			render={children}
		/>
		<Tooltip.Portal>
			<Tooltip.Positioner
				sideOffset={sideOffset}
				side={side}
				align={align}
			>
				<Tooltip.Popup className={tooltipPopup}>{content}</Tooltip.Popup>
			</Tooltip.Positioner>
		</Tooltip.Portal>
	</Tooltip.Root>
)
