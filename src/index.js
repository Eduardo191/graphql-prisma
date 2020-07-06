import '@babel/polyfill'
import server from './server'

server.start({ port: process.env.PORT || 3000 }, ({ port }) => {
  console.log(`The server is up on port ${port}`)
})