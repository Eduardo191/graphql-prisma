import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import bcrypt from 'bcryptjs'

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
})

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  const user = await prisma.mutation.createUser({
    data: {
      name: 'Jhon',
      email: 'jhon@gmail.com',
      password: bcrypt.hashSync('jhon123@!')
    }
  })

  await prisma.mutation.createPost({
    data: {
      title: 'My published post',
      body: '',
      published: true,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })

  await prisma.mutation.createPost({
    data: {
      title: 'My draft post',
      body: '',
      published: false,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })

})

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