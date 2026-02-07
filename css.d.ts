import type * as CSS from 'csstype'

declare module 'csstype' {
	// oxlint-disable-next-line typescript/consistent-type-definitions
	interface Properties {
		// Allow any CSS Custom Properties
		[index: `--${string}`]: any
	}
}
