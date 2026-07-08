import { useTheme } from '#lib/utils/theme'
import type { ComponentProps } from 'react'

type AdaptiveIconProps = Omit<ComponentProps<'img'>, 'src'> & {
	src: {
		light: string
		dark: string
	}
}

export const AdaptiveIcon = ({ src, ...props }: AdaptiveIconProps) => {
	const { theme } = useTheme()

	return theme === 'auto' ? (
		<picture>
			<source
				srcSet={src.dark}
				media="(prefers-color-scheme: dark)"
			/>
			<img
				src={theme === 'auto' ? src.light : src[theme]}
				{...props}
			/>
		</picture>
	) : (
		<img
			src={src[theme]}
			{...props}
		/>
	)
}
