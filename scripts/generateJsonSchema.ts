import z from 'zod'

import { configSchema } from '@/lib/config/schema'

const jsonSchema = z.toJSONSchema(configSchema, {
	io: 'input',
})

await Bun.write('config.schema.json', JSON.stringify(jsonSchema, null, 2))
await Bun.$`bun run format config.schema.json`
