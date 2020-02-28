const path = require('path');
const readline = require('readline');
const fs = require('fs');

const {
    ApolloServer,
    gql,
    AuthenticationError,
    ApolloError,
} = require('apollo-server-express');

//const GraphQLJSON = require('graphql-type-json');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const _ = require('lodash');

const numeral = require('numeral');
require('numeral/locales');
numeral.locale('pt-br');

const moment = require('moment');

//const jwt = require('jsonwebtoken');

module.exports = models => {
    // const like =
    //     models.Cargo.sequelize.options.dialect === 'sqlite'
    //         ? Op.like
    //         : Op.iLike;

    const typeDefs = gql`
        extend type Query {
            getWords: JSON
            getLivros(options: JSON!): JSON
            getLivroLinhas(options: JSON!): JSON
        }
        # extend type Mutation {
        # }
    `;

    const resolvers = {
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
            getLivros(parent, args, context, info) {
                return models.LivroPalavra.findAll({
                    include: [
                        {
                            model: models.Livro,
                            as: 'livro',
                            //attributes: ['id', 'codigo', 'descricao'],
                            //through: { attributes: [] },
                        },
                    ],
                    where: {
                        palavra: args.options.palavra,
                    },
                    limit: 100,
                    order: [['qtdOcorrencias', 'DESC']],
                    raw: true,
                    nested: true,
                });
                // .then(livros => {
                //     return livros.toJSON();
                // });
            },
            getLivroLinhas(parent, args, context, info) {
                return models.LivroPalavra.findByPk(args.options.idLivro, {
                    include: [
                        {
                            model: models.Livro,
                            as: 'livro',
                            //attributes: ['id', 'codigo', 'descricao'],
                            //through: { attributes: [] },
                        },
                    ],
                    //raw: true,
                    //nested: true,
                }).then(livro => {
                    return new Promise(resolve => {
                        {
                            const rl = readline.createInterface({
                                input: fs.createReadStream(
                                    path.join(
                                        process.cwd(),
                                        'livros',
                                        livro.livro.nomeArquivo
                                    )
                                ),
                                crlfDelay: Infinity,
                            });

                            const arr = [];
                            let lineNumber = 0;
                            let arrPos = 0;

                            rl.on('line', line => {
                                lineNumber++;
                                if (lineNumber === livro.numLinhas[arrPos]) {
                                    arr.push({
                                        numero: lineNumber,
                                        conteudo: line,
                                    });
                                    arrPos++;
                                }
                            });

                            rl.on('close', () => {
                                resolve(arr);
                            });
                        }
                    });
                });
                // .then(livros => {
                //     return livros.toJSON();
                // });
            },
        },
        // Mutation: {},
    };

    return {
        typeDefs,
        resolvers,
    };
};
