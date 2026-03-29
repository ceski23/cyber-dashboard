import clsx from 'clsx'
import type { CSSProperties } from 'react'
import * as styles from './style.css'

type SkeletonProps = {
	className?: string
	style?: CSSProperties
	width?: CSSProperties['width']
	height?: CSSProperties['height']
	borderRadius?: CSSProperties['borderRadius']
}

export const Skeleton = ({ className, style, width, height, borderRadius }: SkeletonProps) => (
	<div
		aria-hidden="true"
		className={clsx(styles.skeleton, className)}
		style={{ width, height, borderRadius, ...style }}
	/>
)
