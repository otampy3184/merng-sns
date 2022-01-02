const { AuthenticationError, UserInputError} = require('apollo-server');

const checkAuth = require('../../util/check-auth')
const Post = require('../../models/Post');

module.exports = {
    Mutation: {
        createComment: async (_, {postId, body }, context) => {
            const { username } = checkAuth(constext)
        }
    }
}