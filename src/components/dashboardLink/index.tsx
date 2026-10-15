import { createContext, useContext } from 'react'
import type { ComponentProps } from 'react'

export const OpenLinksInNewTabContext = createContext(true)

export const DashboardLink = (props: ComponentProps<'a'>) => {
	const openInNewTab = useContext(OpenLinksInNewTabContext)

	return (
		<a
			{...props}
			target={openInNewTab ? '_blank' : '_self'}
			rel="noopener noreferrer"
		/>
	)
}
