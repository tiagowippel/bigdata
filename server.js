'use strict';

//TODO  WINSTON LOG

require('dotenv').config();

const path = require('path');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database_test', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: txt => {},
});

const models = require('./backend/models')(sequelize, Sequelize);

sequelize
    .sync({
        force: false,
        match: /_test$/,
    })
    .then(res => {});

const loggingMiddleware = (req, res, next) => {
    console.log('ip:', req.ip, req.url);
    next();
};

app.use(loggingMiddleware);

const api = require('./backend/api/api')(models);
app.use('/api', api);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

const graphql = require('./backend/graphql')(models);

const {
    ApolloServer,
    gql,
    AuthenticationError,
    ApolloError,
    makeExecutableSchema,
} = require('apollo-server-express');

const jwt = require('jsonwebtoken');

const colors = require('colors');

const server = new ApolloServer({
    typeDefs: graphql.typeDefs,
    resolvers: graphql.resolvers,
    formatError: err => {
        return err;
    },
    context: ({ req }) => {},
});

server.applyMiddleware({ app });
