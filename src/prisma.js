import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://192.168.99.100:4466/'
})

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({ id: postId })

  const post = await prisma.mutation.updatePost({
    where: {
      id: postId
    },
    data
  }, '{ author { id name email posts { id title published } } }')
  
  return post.author
}

const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId })

  if (!userExists) {
    throw new Error('User not found!')
  }

  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ author { id name email posts { id title published } } }')
  
  return post.author
}

updatePostForUser('ckar37aoq004307053frywkk1', {
  body: 'Body updated'
}).then((user) => console.log(JSON.stringify(user))).catch((err) => console.log(err))