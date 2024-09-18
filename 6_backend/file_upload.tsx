import { Context, Hono } from '@hono/hono'
import { logger } from '@hono/hono/logger'

// Hang rountes at /file in main.ts
export const file_upload = new Hono()
  .use(logger())
  .get('/', (c: Context) => {
    return c.html(Main())
  })
  .post('/', async (c: Context) => {
    const body = await c.req.parseBody()
    const file = body['upfile'] as File
    if (!file) {
      return c.json({ error: 'No file uploaded' })
    }
    const { name, type, size } = file
    return c.json({ name, type, size })
  })

export const Main = () => (
  <>
    {/* {{ __html: "!DOCTYPE html" }} */}
    <html lang='en'>
      <body>
        <div style='text-align:center; display: flex; justify-content: center; align-items: center; height: 33vh; border: 3px solid green;'>
          <p>Give me your file</p>
        </div>
        <div style='text-align:center; display: flex; justify-content: center; align-items: center; height: 33vh; border: 3px solid green;'>
        <form enctype="multipart/form-data" method="post" action="/api/fileanalyse">
            <input id="inputfield" type="file" name="upfile" />
            <input id="button" type="submit" value="Upload" />
          </form>
        </div>
      </body>
    </html>
  </>
)
