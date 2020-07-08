import 'cross-fetch/polyfill'
import seedDatabase, { userOne, commentOne, commentTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment } from './utils/operations'
import prisma from '../src/prisma'

const client = getClient()

beforeEach(seedDatabase)

test('Should delete own comment', async () => {
  const client = getClient(userOne.jwt)
  const variables = {
    id: commentTwo.comment.id
  }

  await client.mutate({ mutation: deleteComment, variables })
  const exists = await prisma.exists.Comment({ id: commentTwo.comment.id })

  expect(exists).tobe(false)
})

test('Should not delete other users comments', async () => {
  const client = getClient(userOne.jwt)
  const variables = {
    id: commentOne.comment.id
  }

  await client.mutate({ mutation: deleteComment, variables })
  const exists = await prisma.exists.Comment({ id: commentOne.comment.id })

  expect(exists).tobe(true)
})