import { formatForDisplay, useHotkey } from '@tanstack/react-hotkeys'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Command } from 'cmdk'
import { isNotNil } from 'es-toolkit'
import { RotateCcwIcon, SearchIcon } from 'lucide-react'
import { Fragment, FunctionComponent, useState } from 'react'

import { Kbd } from '@/components/kbd'
import { reloadConfigFn } from '@/lib/config'

import { styles } from './style.css'

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
			<button
				className={styles.commandPalette.trigger.root}
				onClick={() => setOpen(true)}
			>
				<SearchIcon size={14} />
				Search...
				<Kbd
					variant="dark"
					className={styles.commandPalette.trigger.hotkey}
				>
					{formatForDisplay('Mod+K')}
				</Kbd>
			</button>
			<Command.Dialog
				open={open}
				onOpenChange={setOpen}
				overlayClassName={styles.commandPalette.overlay}
				contentClassName={styles.commandPalette.dialog}
				className={styles.commandPalette.content}
			>
				<div className={styles.commandPalette.inputWrapper}>
					<SearchIcon size={20} />
					<Command.Input
						className={styles.commandPalette.input}
						placeholder="Type a command or search..."
					/>
					<Kbd variant="light">{formatForDisplay('Escape')}</Kbd>
				</div>
				<Command.List className={styles.commandPalette.list}>
					<Command.Empty className={styles.commandPalette.empty}>No results found</Command.Empty>
					<Command.Group
						className={styles.commandPalette.group}
						heading="General"
					>
						<Command.Item
							className={styles.commandPalette.item.root}
							onSelect={handleReloadConfig}
						>
							<RotateCcwIcon className={styles.commandPalette.item.icon} />
							Reload config
							<Kbd
								variant="light"
								className={styles.commandPalette.item.hotkey}
							>
								{formatForDisplay('Mod+R')}
							</Kbd>
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					{Object.entries(links).map(([type, links]) => (
						<Command.Group
							key={type}
							className={styles.commandPalette.group}
							heading={type}
						>
							{links.map(link => (
								<Command.Item
									className={styles.commandPalette.item.root}
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
										{isNotNil(link.icon) ? (
											<img
												src={link.icon}
												alt={link.label}
												className={styles.commandPalette.item.icon}
											/>
										) : (
											<span className={styles.commandPalette.item.icon} />
										)}
										{link.label}
									</a>
								</Command.Item>
							))}
						</Command.Group>
					))}
				</Command.List>
			</Command.Dialog>
		</Fragment>
	)
}
