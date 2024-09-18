import { assert } from '@std/assert'
import { rot13 } from './caesars.ts'

Deno.test("Caesar's Cipher", () => {
  const result = rot13('SERR PBQR PNZC.')
  const expected = 'FREE CODE CAMP.'
  assert(result === expected)
})
