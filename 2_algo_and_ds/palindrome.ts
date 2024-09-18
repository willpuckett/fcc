export const palindrome = (str: string) => {
  str = str.toLowerCase()
    .replace(/[^0-9a-z]/g, '')

  return str === str.split('').reverse().join('')
}

// console.log(palindrome("not a palindrome"))
