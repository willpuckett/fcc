const numerals: [string, number][] = [
  ['M', 1000],
  ['CM', 900],
  ['D', 500],
  ['CD', 400],
  ['C', 100],
  ['XC', 90],
  ['L', 50],
  ['XL', 40],
  ['X', 10],
  ['IX', 9],
  ['V', 5],
  ['IV', 4],
  ['I', 1],
]

export const convertToRoman = (arg: number) =>
  numerals
    .slice()
    .map(([numeral, num]) => {
      const place = numeral.repeat(Math.floor(arg / num))
      arg %= num
      return place
    })
    .reduce((a, b) => a + b)

// console.log(convertToRoman(36));
