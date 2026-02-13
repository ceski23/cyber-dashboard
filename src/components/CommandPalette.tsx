import { formatForDisplay, useHotkey } from '@tanstack/react-hotkeys'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { RotateCcwIcon } from 'lucide-react'
import { Fragment, FunctionComponent, useState } from 'react'

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
import { reloadConfigFn } from '@/lib/config'

import { Button } from './ui/button'
import { Kbd } from './ui/kbd'

type CommandPaletteProps = {
	links: Record<
		string,
		{
			type: string
			label: string
			url: string
			icon?: string
		}[]
	>
}

export const CommandPalette: FunctionComponent<CommandPaletteProps> = ({ links }) => {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()
	const reloadConfig = useServerFn(reloadConfigFn)

	const handleReloadConfig = async () => {
		await reloadConfig()
		void queryClient.invalidateQueries()
		await router.invalidate()
		setOpen(false)
	}

	useHotkey('Mod+K', () => setOpen(open => !open))

	useHotkey('Mod+R', async event => {
		event.preventDefault()
		await handleReloadConfig()
	})

	return (
		<Fragment>
			<Button
				variant="outline"
				onClick={() => setOpen(true)}
			>
				Open Command Palette <Kbd>{formatForDisplay('Mod+K')}</Kbd>
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
								<Kbd className="ml-auto">{formatForDisplay('Mod+R')}</Kbd>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						{Object.entries(links).map(([type, links]) => (
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
