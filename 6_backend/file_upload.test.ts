import { assert } from '@std/assert/assert'
import { file_upload, Main } from './file_upload.tsx'
import { assertStringIncludes } from '@std/assert'

// const html =
//   `<html lang="en"><body><div style="text-align:center; display: flex; justify-content: center; align-items: center; height: 33vh; border: 3px solid green;"><p>Give me your file</p></div><div style="text-align:center; display: flex; justify-content: center; align-items: center; height: 33vh; border: 3px solid green;"><form method="post" enctype="multipart/form-data"><input type="file" name="upfile"><button type="submit">Upload</button></form></div></body></html>`

Deno.test('Routes', async (t) => {
  const file = new File(['hello world'], 'hello.txt')
  const form = new FormData()
  form.append('upfile', file)
  // const req = new Request('/', { method: 'POST', body: form })

  await t.step('GET', async () => {
    const res = await file_upload.request('/')
    const body = await res.text()
    assertStringIncludes(body, await Main())
  }),
    await t.step('POST:EMPTY', async () => {
      const res = await file_upload.request('/', { method: 'POST' })
      const body = await res.json()
      assert(body.error == 'No file uploaded')
    }),
    await t.step('POST:FILE', async () => {
      const res = await file_upload.request('/', { method: 'POST', body: form })
      const body = await res.json()
      assert(body.name === 'hello.txt')
      assert(body.type === 'application/octet-stream')
      assert(body.size === 11)
    })
})
