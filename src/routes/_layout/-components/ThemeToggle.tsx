import { useTheme, type Theme } from '#lib/utils/theme'
import { Monitor, Moon, Sun } from 'lucide-react'
import type { FunctionComponent } from 'react'
import * as styles from './ThemeToggle.css'

const NEXT_THEME: Record<Theme, Theme> = {
	dark: 'light',
	light: 'auto',
	auto: 'dark',
}

const THEME_ICON: Record<Theme, React.ReactNode> = {
	dark: <Moon size={14} />,
	light: <Sun size={14} />,
	auto: <Monitor size={14} />,
}

const THEME_LABEL: Record<Theme, string> = {
	dark: 'Switch to light theme',
	light: 'Switch to auto theme',
	auto: 'Switch to dark theme',
}

export const ThemeToggle: FunctionComponent = () => {
	const { theme, setTheme } = useTheme()

	return (
		<button
			className={styles.button}
			onClick={() => setTheme(NEXT_THEME[theme])}
			aria-label={THEME_LABEL[theme]}
			title={THEME_LABEL[theme]}
		>
			{THEME_ICON[theme]}
		</button>
	)
}
