import { Hono } from '@hono/hono'
import { marked } from 'npm:marked'
import { cors } from '@hono/hono/cors'

// Routes
import { file_upload } from './file_upload.tsx'
import { exercise } from './exercise_tracker.ts'
import { header_parser } from './header_parser.ts'
import { shorturl } from './shorturl.ts'
import { timestamp } from './timestamp.ts'

const api = new Hono()
  .route('/whoami', header_parser)
  .route('/shorturl', shorturl)
  .route('/users', exercise)
  .route('/fileanalyse', file_upload)
  .route('/', timestamp)

const app = new Hono()
  .use(cors())
  .route('/api', api)
  .get(
    '/',
    async (c) =>
      c.html(await marked(await Deno.readTextFile('./6_backend/README.md'))),
  )

export type AppType = typeof app

Deno.serve(app.fetch)
