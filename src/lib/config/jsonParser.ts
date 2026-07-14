import { findNodeAtLocation, getNodeValue, parseTree } from 'jsonc-parser'
import type { JSONPath, Node } from 'jsonc-parser'
import type { ParsedDocument, SourceLocation } from './parsedDocument'

const offsetToLineCol = (text: string, offset: number): { line: number; column: number } => {
	const before = text.slice(0, offset)
	const line = before.split('\n').length
	const lastNewline = before.lastIndexOf('\n')
	const column = offset - lastNewline
	return { line, column }
}

const nodeToLocation = (text: string, node: Node): SourceLocation => ({
	start: offsetToLineCol(text, node.offset),
	end: node.length > 0 ? offsetToLineCol(text, node.offset + node.length) : undefined,
})

export const parseJsoncDocument = (text: string): ParsedDocument => {
	const tree = parseTree(text)
	if (!tree) {
		throw new Error('Failed to parse JSON/JSONC document')
	}

	const data = getNodeValue(tree) as Record<string, unknown>

	const getNode = (path: (string | number)[]): SourceLocation | undefined => {
		const node = findNodeAtLocation(tree, path as JSONPath)
		if (!node) return undefined
		return nodeToLocation(text, node)
	}

	return { data, sourceText: text.replaceAll('\t', ' '), format: 'json', getNode }
}
