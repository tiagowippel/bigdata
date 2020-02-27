'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const {
    ApolloServer,
    gql,
    AuthenticationError,
    ApolloError,
} = require('apollo-server-express');

module.exports = models => {
    const dirs = fs.readdirSync(__dirname, {});

    const graphql = dirs
        .filter(dir => {
            return fs.lstatSync(path.join(__dirname, dir)).isDirectory();
        })
        .reduce(
            (obj, dir) => {
                const files = fs.readdirSync(path.join(__dirname, dir), {});

                files
                    .filter(file => {
                        return file.slice(-3) === '.js';
                    })
                    .forEach(file => {
                        const req = require(path.join(__dirname, dir, file))(
                            models
                        );
                        obj.typeDefs.push(req.typeDefs);
                        obj.resolvers.push(req.resolvers);
                    });

                return obj;
            },
            {
                typeDefs: [
                    gql`
                        scalar JSON

                        type Query {
                            teste: JSON
                        }

                        type Mutation {
                            teste: JSON
                        }
                    `,
                ],
                resolvers: [
                    {
                        Query: {},
                        Mutation: {},
                    },
                ],
            }
        );

    return graphql;
};
