import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { RecipeVariants } from '@vanilla-extract/recipes'
import clsx from 'clsx'
import type { FunctionComponent, ReactElement } from 'react'
import type { PropsWithChildren } from 'react'
import * as styles from './style.css'

type RootVariants = RecipeVariants<typeof styles.root>
type ContentVariants = RecipeVariants<typeof styles.content>

type RootProps = useRender.ComponentProps<'div'> & RootVariants

const Root: FunctionComponent<RootProps> = ({ render, tone, interactive, ...props }) => {
	const element = useRender({
		defaultTagName: 'div',
		render,
		props: mergeProps<'div'>(
			{
				className: styles.root({ tone, interactive }),
			},
			props,
		),
	})

	return element
}

type ContentProps = ContentVariants &
	PropsWithChildren<{
		className?: string
	}>

const Content: FunctionComponent<ContentProps> = ({ className, padding, gap, children, ...props }) => (
	<div
		className={clsx(styles.content({ padding, gap }), className)}
		{...props}
	>
		{children}
	</div>
)

type HeaderProps = PropsWithChildren<{
	className?: string
	icon?: ReactElement
	label?: string
}>

const Header: FunctionComponent<HeaderProps> = ({ className, icon, label, children, ...props }) => {
	const hasLabel = label != null && label !== ''
	const showIconRow = icon != null || hasLabel

	return (
		<div
			className={clsx(styles.header, className)}
			{...props}
		>
			{showIconRow && (
				<div className={styles.iconRow}>
					{icon != null && <div className={styles.iconBadge}>{icon}</div>}
					{hasLabel && <span className={styles.label}>{label}</span>}
				</div>
			)}
			{children}
		</div>
	)
}

type EyebrowProps = PropsWithChildren<{
	className?: string
}>

const Eyebrow: FunctionComponent<EyebrowProps> = ({ className, children, ...props }) => (
	<div
		className={clsx(styles.eyebrow, className)}
		{...props}
	>
		{children}
	</div>
)

type DividerProps = PropsWithChildren<{
	className?: string
}>

const Divider: FunctionComponent<DividerProps> = ({ className, children, ...props }) => (
	<div
		className={clsx(styles.divider, className)}
		{...props}
	>
		{children}
	</div>
)

export const Card = Object.assign(
	{},
	{
		Root,
		Content,
		Header,
		Eyebrow,
		Divider,
	},
)
