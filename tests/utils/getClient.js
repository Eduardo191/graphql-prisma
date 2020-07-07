import ApolloBoost from 'apollo-boost'

const getClient = (jwt) => {
  const client = new ApolloBoost({
    uri: 'http://localhost:4000',
    request(operation) {
      if (jwt) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
      }
    }
  })

  return client
}

export { getClient as default }