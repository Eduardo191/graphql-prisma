import 'cross-fetch/polyfill'
import seedDatabase, { userOne, commentOne, commentTwo, postOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment, subscribeToComments, subscribeToPosts } from './utils/operations'
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

test('Should subscribe to comments for a post', async () => {
  const variables = {
    postId: postOne.post.id
  }

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).tobe('DELETED')
      done()
    }
  })

  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id }})
})

test('Should subscribe to changes for published posts', async () => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).tobe('DELETED')
      done()
    }
  }) 

  await prisma.mutation.deletePost({ where: { id: postOne.post.id }})
})