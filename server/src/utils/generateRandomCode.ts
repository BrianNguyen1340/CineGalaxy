import { randomBytes } from 'crypto'

export const generateRandomString = (length: number): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters[randomIndex]
  }

  return result
}

export const generateRandomNumber = (length: number): string => {
  const buffer = randomBytes(length)
  let code = ''

  for (let i = 0; i < buffer.length; i++) {
    code += (buffer[i] % 10).toString()
  }

  return code.slice(0, length)
}

export const generateRandomToken = (length: number): string => {
  return randomBytes(length).toString('hex')
}
