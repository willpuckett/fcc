import { Hono } from '@hono/hono'
import { validator } from '@hono/hono/validator'
import { logger } from '@hono/hono/logger'
import { z } from 'npm:zod'
import { kv } from './db.ts'
import { lookup } from 'node:dns'

// Hang routes at /api/shorturl in main.ts

export const shorturl = new Hono()
  .use(logger())
  .post(
    '/',
    validator('form', (value, c) => {
      const { success, data } = z.string().url().safeParse(value.url)
      return success ? data : c.json({ error: 'invalid url' })
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
