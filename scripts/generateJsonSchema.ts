import { configSchema } from '#lib/config/schema'
import z from 'zod'

const jsonSchema = z.toJSONSchema(configSchema, {
	io: 'input',
})

await Bun.write('config.schema.json', JSON.stringify(jsonSchema, null, 2))
await Bun.$`bun run format config.schema.json`
