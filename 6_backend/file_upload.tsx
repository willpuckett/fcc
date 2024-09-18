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
    <html>
      <head>
        <title>File Metadata</title>
        <link
          rel='shortcut icon'
          href='https://cdn.freecodecamp.org/universal/favicons/favicon-32x32.png'
          type='image/x-icon'
        />
        <link
          href='https://fonts.googleapis.com/css?family=Roboto'
          rel='stylesheet'
          type='text/css'
        />
        <link href='/public/style.css' rel='stylesheet' type='text/css' />
      </head>

      <body>
        <div class='container'>
          <h1>API Project: File Metadata Microservice</h1>

          <h2>Usage:</h2>
          <p>
            Please Upload a File ...
          </p>
          <div class='view'>
            <h3 id='output'></h3>
            <form
              enctype='multipart/form-data'
              method='post'
              action='/api/fileanalyse'
            >
              <input id='inputfield' type='file' name='upfile' />
              <input id='button' type='submit' value='Upload' />
            </form>
          </div>
        </div>
        <div class='footer'>
          <p>
            by
            <a href='http://www.freecodecamp.com'>freeCodeCamp</a>
          </p>
        </div>
      </body>
    </html>
  </>
)
