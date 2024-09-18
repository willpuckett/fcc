export const telephoneCheck = (str: string) =>
  /^1? ?([0-9]{3}|\([0-9]{3}\))(-| )?[0-9]{3}(-| )?[0-9]{4}$/.test(str)

// console.log(telephoneCheck("555-555-5555"));
