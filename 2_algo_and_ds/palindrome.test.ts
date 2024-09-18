import { assert } from '@std/assert'
import { palindrome } from './palindrome.ts'

Deno.test('Palindrome Checker', () => {
  const result1 = palindrome('not a palindrome')
  const result2 = palindrome("Madam, I'm Adam")
  assert(result1 === false && result2 === true)
})
