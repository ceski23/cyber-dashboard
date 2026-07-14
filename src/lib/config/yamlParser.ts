import { isMap, isScalar, isSeq, LineCounter, parseDocument } from 'yaml'
import type { ParsedNode } from 'yaml'
import type { ParsedDocument, SourceLocation } from './parsedDocument'

const traverseNode = (node: ParsedNode, path: (string | number)[]): ParsedNode | undefined => {
	let current = node
	for (const segment of path) {
		if (isMap(current)) {
			const pair = current.items.find(p => isScalar(p.key) && p.key.value === segment)
			if (!pair) return undefined
			current = pair.value as ParsedNode
		} else if (isSeq(current)) {
			if (typeof segment !== 'number' || segment < 0 || segment >= current.items.length) {
				return undefined
			}
			current = current.items[segment] as ParsedNode
		} else {
			return undefined
		}
	}
	return current
}

const rangeToLocation = (range: [number, number, number], lineCounter: LineCounter): SourceLocation => {
	const start = lineCounter.linePos(range[0])
	const end = lineCounter.linePos(range[1])
	return {
		start: { line: start.line, column: start.col },
		end: { line: end.line, column: end.col },
	}
}

export const parseYamlDocument = (text: string): ParsedDocument => {
	const lineCounter = new LineCounter()
	const doc = parseDocument(text, { lineCounter })
	if (!doc.contents) {
		throw new Error('Failed to parse YAML document')
	}

	const data = doc.toJS() as Record<string, unknown>

	const getNode = (path: (string | number)[]): SourceLocation | undefined => {
		const node = traverseNode(doc.contents as ParsedNode, path)
		if (!node?.range) return undefined
		return rangeToLocation(node.range, lineCounter)
	}

	return { data, sourceText: text, format: 'yaml', getNode }
}
