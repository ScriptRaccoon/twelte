import { createClient } from '@libsql/client'
import { writeFileSync } from 'fs'

/**
 * This script generates a mermaid.js ERD diagram from the local SQLite database
 */

export const db = createClient({
	url: 'file:database/twelte.db'
})

async function getTables(): Promise<string[]> {
	const { rows } = await db.execute(
		`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
	)
	return rows.map((row) => row.name as string)
}

type Column = {
	name: string
	type: string
	pk: number
}

async function getColumns(table: string): Promise<Column[]> {
	const { rows } = await db.execute(`PRAGMA table_info(${table})`)
	return rows as unknown as Column[]
}

type ForeignKey = {
	table: string
	from: string
	to: string
}

async function getForeignKeys(table: string): Promise<ForeignKey[]> {
	const { rows } = await db.execute(`PRAGMA foreign_key_list(${table})`)
	return rows as unknown as ForeignKey[]
}

async function generateMermaidERD() {
	const tables = await getTables()
	const lines = ['# Database Diagram', '', '\`\`\`mermaid', 'erDiagram']

	for (const table of tables) {
		lines.push(`  ${table} {`)
		const cols = await getColumns(table)
		for (const col of cols) {
			const pk = col.pk ? ' PK' : ''
			lines.push(`    ${col.type} ${col.name}${pk}`)
		}
		lines.push('  }')
	}

	for (const table of tables) {
		const keys = await getForeignKeys(table)
		for (const fk of keys) {
			lines.push(`  ${table} }o--|| ${fk.table} : "${fk.from} → ${fk.to}"`)
		}
	}

	lines.push('\`\`\`')

	return lines.join('\n')
}

async function main() {
	const diagram = await generateMermaidERD()
	writeFileSync('DATABASE.md', diagram, 'utf8')
}

main()
