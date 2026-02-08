import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { RotateCcwIcon } from 'lucide-react'
import { Fragment, FunctionComponent, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

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
import { metaKey } from '@/lib/utils'

import { Button } from './ui/button'
import { Kbd, KbdGroup } from './ui/kbd'

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

	useHotkeys('mod+k', () => setOpen(open => !open))

	useHotkeys('mod+r', async event => {
		event.preventDefault()
		await handleReloadConfig()
	})

	return (
		<Fragment>
			<Button
				variant="outline"
				onClick={() => setOpen(true)}
			>
				Open Command Palette{' '}
				<KbdGroup>
					<Kbd>{metaKey}</Kbd>
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
								<KbdGroup className="ml-auto">
									<Kbd>{metaKey}</Kbd>
									<Kbd>R</Kbd>
								</KbdGroup>
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
