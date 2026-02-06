import { useRouter } from '@tanstack/react-router'
import { groupBy } from 'es-toolkit'
import { RotateCcwIcon } from 'lucide-react'
import { Fragment, FunctionComponent, useEffect, useState } from 'react'

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command'
import type { Config } from '@/lib/config'
import { widgets } from '@/widgets'

import { Button } from './ui/button'
import { Kbd, KbdGroup } from './ui/kbd'

type CommandPaletteProps = {
	config: Config
}

export const CommandPalette: FunctionComponent<CommandPaletteProps> = ({ config }) => {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const allLinks = groupBy(
		// @ts-expect-error should be correct based on the provideLinks definition in the widget definitions.
		config.widgets.flatMap(widget => widgets[widget.type].provideLinks?.(widget.options) ?? []),
		link => link.type,
	)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault()
				setOpen(open => !open)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	const handleReloadConfig = () => {
		router.invalidate()
		setOpen(false)
	}

	return (
		<Fragment>
			<Button
				variant="outline"
				onClick={() => setOpen(true)}
			>
				Open Command Palette{' '}
				<KbdGroup>
					<Kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
			>
				<Command>
					<CommandInput placeholder="Type a service..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="General">
							<CommandItem onSelect={handleReloadConfig}>
								<RotateCcwIcon className="mr-2 inline-block h-4 w-4" />
								Reload config
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						{Object.entries(allLinks).map(([type, links]) => (
							<CommandGroup
								key={type}
								heading={type}
							>
								{links.map(link => (
									<CommandItem
										asChild
										key={link.url}
										onSelect={() => {
											window.location.href = link.url
										}}
									>
										<a
											href={link.url}
											rel="noopener noreferrer"
										>
											<img
												src={link.icon}
												alt={`${link.label} icon`}
												className="mr-2 inline-block h-4 w-4"
											/>
											{link.label}
										</a>
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</CommandDialog>
		</Fragment>
	)
}
