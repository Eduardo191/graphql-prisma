import ApolloBoost from 'apollo-boost'

const getClient = () => {
  const client = new ApolloBoost({
    uri: 'http://localhost:4000'
  })

  return client
}

export { getClient as default }