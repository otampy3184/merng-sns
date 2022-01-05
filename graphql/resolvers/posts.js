const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPost() {
            try{
                //作成時間順にソート
                const posts = await Post.find().sort({ createdAt: -1 });  
                return posts;
            } catch(err) {
                throw new Error(err)
            }
        },
        //get post by postid
        async getPost(_, { postId }) {
            try {
                //postidからpostをawaitで取得
                const post = await Post.findById(postId)
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error('err')
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            //user authentication
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post body must be empty');
            }

            //New post object
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Data().toISOString()
            });

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post;
        },

        //delete post by id
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context)
            
            //postを検索
            try {
                const post = await Post.findById(postId) 
                //ユーザー判別
                if (user.name === post.username) {
                    await post.delete();
                    //メッセージのみ返す
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            }catch(err){
                throw new Error(err)
            }
        },

        //like post by id
        async likePost(_, { postId }, context ) {
            const { username } = checkAuth(context);

            //Post取得
            const post = await Post.findById(postId);
            if (post) {
                if( post.likes.find((like) => like.username === username )) {
                    post.likes = post.likes.filter((like) => like.username !== username);
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Data().toISOString()
                    });
                }
                await post.save();
                return post;

            } else throw new UserInputError('Post not found')
        } 
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
};