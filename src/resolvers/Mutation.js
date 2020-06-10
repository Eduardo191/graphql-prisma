import { uuid } from 'uuidv4'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
      return prisma.mutation.createUser({ data: args.data }, info)
    },
    async updateUser(parent, args, { prisma }, info) {
      return prisma.mutation.updateUser({ 
        where: {
          id: args.id
        },
        data: args.data
      })
    },
    updatePost(parent, args, { db, pubsub }, info) {
      const post = db.posts.find((post) => args.id === post.id)
      const originalPost = {...post}

      if (!post) {
        throw new Error('Post not found')
      }

      if (typeof args.data.title === 'string') {
        post.title = args.data.title
      }

      if (typeof args.data.body === 'string') {
        post.body = args.data.body
      }

      if (typeof args.data.published === 'boolean') {
        post.published = args.data.published

        if (originalPost.published && !post.published) {
          //deleted
          pubsub.publish('post', {
            post: {
              mutation: 'DELETED',
              data: originalPost
            }
          })
        } else if (!originalPost.published && post.published) {
          //created
          pubsub.publish('post', {
            post: {
              mutation: 'CREATED',
              data: post
            }
          })
        }
      } else if (post.published) {
        //updated
        pubsub.publish('post', {
          post: {
            mutation: 'UPDATED',
            data: post
          }
        })
      }

      return post
    },
    async deleteUser(parent, args, { prisma }, info) {
      return prisma.mutation.deleteUser({ 
        where: {
          id: args.id
         } 
      }, info)
    },
    deletePost(parent, args, { db, pubsub }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id)

      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      
      db.comments = db.comments.filter((comment) => {
        return comment.post !== args.id
      })
      
      const [post] = db.posts.splice(postIndex, 1)

      if (post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: post
          }
        })
      }

      return post
    },
    deleteComment(parent, args, { db, pubsub }, info) {
      const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
      
      if (commentIndex === -1) {
        throw new Error('Comment not found')
      }

      const [comment] = db.comments.splice(commentIndex, 1)

      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: 'DELETED',
          data: comment
        }
      })

      return comment
    },
    createPost(parent, args, { prisma }, info) {
      return prisma.mutation.createPost({ 
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author
            }
          }
        }
      }, info)
    }, 
    createComment(parent, args, { db, pubsub }, info) {
      const userExists = db.users.some((user) => user.id === args.data.author)
      const postExists = db.posts.some((post) => {
        return post.id === args.data.post && post.published
      })

      if (!userExists || !postExists) {
        throw new Error('Unable to find user and post')
      }

      const comment = {
        id: uuid(),
        ...args.data
      }

      db.comments.push(comment)
      pubsub.publish(`comment ${args.data.post}`, {
        comment: {
          mutation: 'CREATED',
          data: comment
        }
      })

      return comment
    },
    updateComment(parent, args, { db, pubsub }, info) {
      const comment = db.comments.find((comment) => args.id === comment.id)

      if (!comment) {
        throw new Error('Comment not found')
      }

      if (typeof args.data.text === 'string') {
        comment.text = args.data.text
      }

      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: 'UPDATED',
          data: comment
        }
      })

      return comment
    }
}

export { Mutation as default }