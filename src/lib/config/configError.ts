import { codeFrameColumns } from '@babel/code-frame'
import { z } from 'zod'
import type { ParsedDocument, SourceLocation } from './parsedDocument'

type BabelLocation = {
	start: { line: number; column: number }
	end?: { line: number; column: number }
}

type ZodIssue = z.ZodError['issues'][number]

type DocumentWithLocation = {
	location: SourceLocation
	document: ParsedDocument
}

const findLocation = (path: PropertyKey[], documents: ParsedDocument[]): DocumentWithLocation | undefined => {
	for (const doc of documents) {
		const location = doc.getNode(path as Array<string | number>)

		if (location) {
			return {
				location,
				document: doc,
			}
		}
	}

	return undefined
}

const toBabelLocation = (loc: SourceLocation): BabelLocation => ({
	start: { line: loc.start.line, column: loc.start.column - 1 },
	end: loc.end ? { line: loc.end.line, column: loc.end.column - 1 } : undefined,
})

const isUnionNoise = (issue: ZodIssue): boolean => {
	if (issue.path.length === 1 && issue.path[0] === 'type') {
		return issue.code === 'invalid_value'
	}

	return false
}

const isRootUnrecognized = (issue: ZodIssue): boolean => issue.path.length === 0 && issue.code === 'unrecognized_keys'

const getLeafErrors = (issues: ZodIssue[], parentPath: PropertyKey[] = []): ZodIssue[] => {
	const results: ZodIssue[] = []

	for (const issue of issues) {
		const fullPath = [...parentPath, ...issue.path]

		if (issue.code === 'invalid_union' && 'errors' in issue) {
			if (issue.errors.length > 0) {
				const scored = issue.errors
					.map(errors => {
						let score = 0
						let depthSum = 0
						let depthCount = 0

						for (const e of errors) {
							if (isUnionNoise(e)) continue
							if (isRootUnrecognized(e)) {
								score--
								continue
							}
							score++
							depthSum += e.path.length
							depthCount++
						}

						return {
							errors,
							score,
							avgDepth: depthCount > 0 ? depthSum / depthCount : 0,
						}
					})
					.sort((a, b) => {
						if (a.score !== b.score) return b.score - a.score
						if (a.avgDepth !== b.avgDepth) return b.avgDepth - a.avgDepth
						return a.errors.length - b.errors.length
					})

				const best = scored.find(m => m.score > 0) ?? scored[0]
				results.push(...getLeafErrors(best.errors, fullPath))
			}
		} else if (!isUnionNoise(issue) && !isRootUnrecognized(issue)) {
			results.push({ ...issue, path: fullPath })
		}
	}

	return results
}

export class ConfigError extends Error {
	#zodError: z.ZodError
	#parsedDocuments: ParsedDocument[]
	formatted: string

	constructor(zodError: z.ZodError, parsedDocuments: ParsedDocument[]) {
		super('Configuration validation failed')
		Object.setPrototypeOf(this, new.target.prototype)
		this.name = this.constructor.name
		this.#zodError = zodError
		this.#parsedDocuments = parsedDocuments
		this.formatted = this.format()
	}

	override toString(): string {
		return this.formatted
	}

	[Symbol.for('nodejs.util.inspect.custom')](_depth: number, options: { colors: boolean }): string {
		return this.format(options.colors)
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			formatted: this.formatted,
			issues: getLeafErrors(this.#zodError.issues).map(issue => `${issue.path.join('.')}: ${issue.message}`),
		}
	}

	format(highlightCode: boolean = false): string {
		const parts: string[] = []

		for (const issue of getLeafErrors(this.#zodError.issues)) {
			parts.push(`${issue.path.join('.')}: ${issue.message}`)

			if (issue.path.length === 0) {
				parts.push(`  <root>: ${issue.message}`)
				continue
			}

			// For unrecognized_keys, try to highlight each individual key
			if (issue.code === 'unrecognized_keys') {
				for (const key of issue.keys) {
					const keyPath = [...issue.path, key]
					const found = findLocation(keyPath, this.#parsedDocuments)

					if (found) {
						const babelLoc = toBabelLocation(found.location)
						const frame = codeFrameColumns(found.document.sourceText, babelLoc, {
							message: issue.message,
							highlightCode,
						})

						parts.push(frame)
					} else {
						parts.push(`  ${[...issue.path, key].join('.')}: Unrecognized key: "${key}"`)
					}
				}

				continue
			}

			// Walk from the full path up to parent, using the first enclosing
			// block that exists in the source document
			let found: { location: SourceLocation; document: ParsedDocument } | undefined
			let parentPath: PropertyKey[] | undefined

			for (let end = issue.path.length; end >= 0; end--) {
				const tryPath = issue.path.slice(0, end)
				found = findLocation(tryPath, this.#parsedDocuments)
				if (found) {
					if (end < issue.path.length) {
						parentPath = issue.path.slice(end)
					}
					break
				}
			}

			if (found) {
				const babelLoc = toBabelLocation(found.location)
				const message = parentPath ? `Missing ${parentPath.join('.')}` : issue.message
				const frame = codeFrameColumns(found.document.sourceText, babelLoc, {
					message,
					highlightCode,
				})
				parts.push(frame)
			} else {
				parts.push(`  ${issue.path.join('.')}: ${issue.message}`)
			}
		}

		return parts.join('\n\n')
	}
}
