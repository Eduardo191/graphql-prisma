import { getFirstName, isValidPassword } from '../src/utils/user.js'

test('Should return first name when given full name', () => {
  const firstName = getFirstName('Eduardo Ferreira')

  expect(firstName).toBe('Eduardo')
})

test('Should return first name when given first name', () => {
  const firstName = getFirstName('Jen')

  expect(firstName).toBe('Jen')
})

test('Should reject password shorter than 8 characters', () => {
  const isValid = isValidPassword('minhasenha123')

  expect(isValid).toBe(true)
})

test('Should reject password that contains word password', () => {
  const isValid = isValidPassword('password123')

  expect(isValid).toBe(false)
})

test('Should correctly validate a valid password', () => {
  const isValid = isValidPassword('Test123098!')

  expect(isValid).toBe(true)
})