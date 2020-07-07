import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Eduardo",
          email: "edu@hotmail.com",
          password: "edu123"
        }
      ) {
        token
        user {
          id 
          name
          email
        }
      }
    }
  `
  const response = await client.mutate({
    mutation: createUser
  })

  const exists = await prisma.exists.User({ id: response.data.createUser.user.id })
  expect(exists).toBe(true)
})

test('Should expose public author profile', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jhon')
})

test('Should not login with bad crdentials', async () => {
  const login = gql`
    mutation {
      login(
        data: {
          email: "maria@gmail.com",
          password: "ahfouqdoy8"
        }
      ) {
        token
      }
    }
  `

  await expect(client.mutate({ mutation: login })).rejects.toThrow()
})

test('Should not sign up with short password', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Pedro",
          email: "pedro@bol.com.br",
          password: "p"
        }
      ) {
        token
      }
    }
  `
  await expect(client.mutate({ mutation: createUser })).rejects.toThrow()
})