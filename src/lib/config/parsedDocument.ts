export type SourceLocation = {
	start: { line: number; column: number }
	end?: { line: number; column: number }
}

export type ParsedDocument = {
	data: Record<string, unknown>
	sourceText: string
	format: 'json' | 'yaml'
	getNode(path: (string | number)[]): SourceLocation | undefined
}
