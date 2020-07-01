import '@babel/polyfill'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import prisma from './prisma'
import { resolvers, fragmentReplacements } from './resolvers/index'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request
    }
  },
  fragmentReplacements
})

const options = {
  port: process.env.PORT || 3000
}

server.start(options, ({ port }) => {
  console.log(`The server is up on port ${port}`)
})