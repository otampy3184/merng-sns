const { AuthenticationError, UserInputError} = require('apollo-server');

const checkAuth = require('../../util/check-auth')
const Post = require('../../models/Post');

//comment用のMutation
module.exports = {
    Mutation: {
        createComment: async (_, {postId, body }, context) => {
            const { username } = checkAuth(constext)
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                  errors: {
                    body: 'Comment body must not empty'
                  }
                });
            }
        const post = await Post.findById(postId);

        if (post) {
            post.comments.unshift({
              body,
              username,
              createdAt: new Date().toISOString()
            });
            await post.save();
            return post;
          } else throw new UserInputError('Post not found');
        },
    }
}