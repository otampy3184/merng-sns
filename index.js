const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');


const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose
    //.connect(MONGODB, { useNewUrlParser: true})
    //謎エラー回避のためべた張り
    //.connect('mongodb+srv://merng:MRu5s9TqUCEZpJxw@cluster0.ko75m.mongodb.net/merng?retryWrites=true&w=majority', {useNewUrlParser: true})
    .then(() => {
        console.log(`MongoDB connected`);
        return server.listen({ port: 5000 })
    })
    .then(res => {
        console.log(`Server is runnitng at ${res.url}`)
    });
    