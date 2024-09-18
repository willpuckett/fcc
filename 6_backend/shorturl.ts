import { Context, Hono } from '@hono/hono'
import { logger } from '@hono/hono/logger'
import { z } from 'npm:zod'
import { kv } from './db.ts'

// Hang routes at /api/shorturl in main.ts

export const shorturl = new Hono()
  .use(logger())
  .post('/', async (c: Context) => {
    const text = await c.req.text()
    const { data: original_url, success } = z.string().url().safeParse(text)
    console.log(text, original_url, success)
    if (!success) {
      return c.json({ error: 'invalid url' })
    }
    const short_url = crypto.randomUUID()
    const { ok } = await kv.set(['short_url', short_url], original_url)
    return c.json(
      ok ? { original_url, short_url } : { error: 'failed to save url' },
    )
  })
  .get('/:id', async (c: Context) => {
    const id = c.req.param('id')
    const { value: url } = await kv.get<string>(['short_url', id])
    if (!url) {
      return c.json({ error: 'invalid url' })
    }
    return c.redirect(url as unknown as string)
  })
