import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { RecipeVariants } from '@vanilla-extract/recipes'
import clsx from 'clsx'
import { isNotNil } from 'es-toolkit'
import type { FunctionComponent, ReactElement } from 'react'
import type { PropsWithChildren } from 'react'
import { match, P } from 'ts-pattern'
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
	labelHref?: string
}>

const Header: FunctionComponent<HeaderProps> = ({ className, icon, label, labelHref, children, ...props }) => {
	const showIconRow = isNotNil(icon) || isNotNil(label)

	return (
		<div
			className={clsx(styles.header, className)}
			{...props}
		>
			{showIconRow && (
				<div className={styles.iconRow}>
					{icon != null && <div className={styles.iconBadge}>{icon}</div>}
					{match({ label, labelHref })
						.with({ label: P.string, labelHref: P.string }, ({ labelHref }) => (
							<a
								href={labelHref}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.labelLink}
							>
								{label}
							</a>
						))
						.with({ label: P.string }, () => <span className={styles.label}>{label}</span>)
						.otherwise(() => null)}
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
