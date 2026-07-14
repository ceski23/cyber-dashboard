import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const styles = {
	root: style({
		maxWidth: '960px',
		margin: '0 auto',
		padding: vars.spacing[6],
	}),

	content: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[4],
	}),

	headerRow: style({
		display: 'flex',
		alignItems: 'center',
		gap: vars.spacing[3],
	}),

	title: style({
		fontSize: vars.text.lg,
		fontWeight: 600,
		color: vars.color.foreground,
	}),

	subtitle: style({
		fontSize: vars.text.sm,
		color: vars.color.foregroundAlt,
		lineHeight: 1.5,
	}),

	summary: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		fontFamily: 'ui-monospace, "Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
		background: transparentize(vars.color.black, 0.3),
		borderRadius: vars.radius.md,
		padding: vars.spacing[3],
		border: `1px solid ${transparentize(vars.color.red[500], 0.15)}`,
		lineHeight: 1.6,
		whiteSpace: 'pre-wrap',
		wordBreak: 'break-all',
	}),

	codeFrame: style({
		fontSize: vars.text.xs,
		fontFamily: 'ui-monospace, "Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
		background: transparentize(vars.color.black, 0.4),
		borderRadius: vars.radius.md,
		padding: vars.spacing[3],
		border: `1px solid ${vars.color.borderSubtle}`,
		lineHeight: 1.5,
		whiteSpace: 'pre',
		overflowX: 'auto',
		color: vars.color.foregroundAlt,
	}),
}
