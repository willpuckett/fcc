import { Hono } from '@hono/hono'
import { validator } from '@hono/hono/validator'
import { logger } from '@hono/hono/logger'
import { z } from 'npm:zod'
import { kv } from './db.ts'
import { promises } from 'node:dns'

// Hang routes at /api/shorturl in main.ts

export const shorturl = new Hono()
  .use(logger())
  .post(
    '/',
    validator('form', async (value, c) => {
      const { success, data } = z.string().transform((v) => (new URL(v)).host)
        .safeParse(value.url)
      if (!success) return c.json({ error: 'invalid url' })
      try {
        await promises.lookup(data)
      } catch {
        return c.json({ error: 'invalid url' })
      }
      return value.url as string
    }),
    async (c) => {
      const original_url = c.req.valid('form')
      const short_url = crypto.randomUUID()
      const { ok } = await kv.set(['short_url', short_url], original_url)
      return c.json(
        ok ? { original_url, short_url } : { error: 'invalid url' },
      )
    },
  )
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    const { value } = await kv.get<string>(['short_url', id])
    return value
      ? c.redirect(value as unknown as string)
      : c.json({ error: 'invalid url' })
  })
