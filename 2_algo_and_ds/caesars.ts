export const rot13 = (str: string) =>
  str
    .split('')
    .map((l) =>
      l.match(/[A-Z]/) ? String.fromCharCode(l.charCodeAt(0) % 26 + 65) : l
    )
    .join('')

// console.log(rot13("SERR PBQR PNZC."));
