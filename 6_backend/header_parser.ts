import { Hono } from '@hono/hono'
import { logger } from '@hono/hono/logger'

// Hang routes at /api/whoami in main.ts

export const header_parser = new Hono()
  .use(logger())
  .get('/', (c) =>
    c.json({
      ipaddress: c.req.header('host') ?? 'bip',
      language: c.req.header('accept-language') ?? 'bop'.split(',')[0],
      software: c.req.header('user-agent') ??
        'b ( ) ( ) p'
          .split(') ')[0].split(' (')[1],
    }))
