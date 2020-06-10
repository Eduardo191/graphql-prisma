const Query = {
    users(parent, args, { prisma }, info) {
      const opArgs = {}

      if (args.query) {
        opArgs.where = {
          OR: [{
            name_contains: args.query
          }, {
            email_contains: args.query
          }]
        }
      }

      return prisma.query.users(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
      return prisma.query.comments(null, info)
    },
    posts(parent, args, { prisma }, info) {
      const opArgs = {}

      if (args.query) {
        opArgs.where = {
          OR: [{
            title_contains: args.query
          }, {
            body_contains: args.query
          }]
        }
      }

      return prisma.query.posts(null, info)
    },
    me() {
      return {
        id: '123908',
        name: 'Mike',
        email: 'mike@gmail.com',
        age: 27
      }
    },
    post() {
      return {
        id: '123098',
        title: 'My test post',
        body: 'This is my first post',
        published: true
      }
    }
}

export { Query as default }