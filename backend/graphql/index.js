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
                            getWords: JSON
                        }

                        type Mutation {
                            teste: JSON
                        }
                    `,
                ],
                resolvers: [
                    {
                        Query: {
                            getWords(parent, args, context, info) {
                                // return [
                                //     { palavra: 'aaa', qtdOcorrencias: 200000 },
                                //     { palavra: 'bbb', qtdOcorrencias: 10 },
                                // ];
                                return models.Palavra.findAll({
                                    limit: 100,
                                    order: [['qtdOcorrencias', 'DESC']],
                                    raw: true,
                                });
                            },
                        },
                        Mutation: {},
                    },
                ],
            }
        );

    return graphql;
};
