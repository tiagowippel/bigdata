'use strict';

const express = require('express');

const fs = require('fs');
const _ = require('lodash');
const iconv = require('iconv-lite');

const jwt = require('jsonwebtoken');

const path = require('path');
const readline = require('readline');
const Promise = require('bluebird');

const sw = require('stopword');

module.exports = models => {
    const api = express.Router();

    api.get('/teste', (req, res) => {});

    api.get('/processarArquivos', (req, res) => {
        const directoryPath = path.join('c:', 'aaa', 'livros');

        const hashPalavras = {};
        let contaPalavras = 0;

        fs.readdir(directoryPath, function(err, files) {
            if (err) {
                return res.send(err);
            }

            Promise.each(
                files.filter((item, k) => k < 10000),
                (file, fileindex) => {
                    return models.Livro.create({
                        titulo: file,
                        nomeArquivo: file,
                    }).then(livro => {
                        //console.log(livro.toJSON());
                        console.log(file, fileindex);

                        return new Promise(resolve => {
                            {
                                let dis = 0;
                                let title = '';

                                const rl = readline.createInterface({
                                    input: fs.createReadStream(
                                        path.join('c:', 'aaa', 'livros', file)
                                    ),
                                    crlfDelay: Infinity,
                                });

                                let lineNumber = 0;
                                const hashPalavras2 = {};

                                rl.on('line', line => {
                                    lineNumber++;

                                    switch (dis) {
                                        case 1:
                                            line = line.toLowerCase();

                                            if (line.includes('end')) {
                                                if (
                                                    line.includes('***end') ||
                                                    (line.includes('end') &&
                                                        line.includes(
                                                            'project'
                                                        ) &&
                                                        line.includes(
                                                            'gutenberg'
                                                        )) ||
                                                    (line.includes('end') &&
                                                        line.includes(
                                                            'etext'
                                                        ) &&
                                                        line.includes('this'))
                                                ) {
                                                    dis = 2;
                                                    break;
                                                }
                                            } else if (
                                                line.includes('<<this')
                                            ) {
                                                dis = 2;
                                                break;
                                            }

                                            line = line.replace(
                                                /[^a-zA-Z0-9_-]/g,
                                                ' '
                                            );

                                            let arr = line.split(' ');

                                            arr = sw.removeStopwords(arr);

                                            for (
                                                let j = 0;
                                                j < arr.length;
                                                j++
                                            ) {
                                                const p = arr[j];

                                                if (p.length < 1) {
                                                    continue;
                                                }

                                                //if (fileindex === 67)
                                                //console.log(p);

                                                if (
                                                    !hashPalavras['word_' + p]
                                                ) {
                                                    contaPalavras++;
                                                    hashPalavras[
                                                        'word_' + p
                                                    ] = {
                                                        p,
                                                        q: 0,
                                                    };
                                                }
                                                hashPalavras['word_' + p].q++;

                                                if (
                                                    !hashPalavras2['word_' + p]
                                                ) {
                                                    hashPalavras2[
                                                        'word_' + p
                                                    ] = {
                                                        p,
                                                        q: 0,
                                                        lines: new Set(),
                                                    };
                                                }
                                                hashPalavras2['word_' + p].q++;
                                                hashPalavras2[
                                                    'word_' + p
                                                ].lines.add(lineNumber);
                                            }
                                            break;
                                        case 0:
                                            if (
                                                title === '' &&
                                                line
                                                    .toLowerCase()
                                                    .includes('title:')
                                            ) {
                                                title = line.substr(7);
                                                //console.log(title);
                                            }

                                            if (line.includes('*END*')) {
                                                dis = 1;
                                            } else if (
                                                line.includes('*** START') ||
                                                line.includes('***START') ||
                                                line.includes('MEMBERSHIP.>>')
                                            ) {
                                                dis = 1;
                                            }
                                            break;

                                        default:
                                            break;
                                    }
                                });

                                rl.on('close', () => {
                                    if (dis == 0) {
                                        console.log('Not Disclaime ' + file);
                                    }
                                    if (dis == 1) {
                                        console.log(
                                            'Not END Disclaime ' + file
                                        );
                                    }

                                    //console.log(hashPalavras2);

                                    return livro
                                        .update({
                                            titulo: title,
                                            //caminho: file,
                                        })
                                        .then(() => {
                                            //console.log(res.toJSON());

                                            return models.LivroPalavra.bulkCreate(
                                                _.values(hashPalavras2).map(
                                                    item => {
                                                        return {
                                                            idLivro: livro.id,
                                                            palavra: item.p,
                                                            qtdOcorrencias:
                                                                item.q,
                                                            numLinhas: Array.from(
                                                                item.lines
                                                            ),
                                                        };
                                                    }
                                                )
                                            );
                                        })
                                        .then(() => {
                                            resolve();
                                        });
                                });
                            }
                        });
                    });
                }
            ).then(() => {
                return models.Palavra.bulkCreate(
                    _.values(hashPalavras).map(item => {
                        return {
                            palavra: item.p,
                            qtdOcorrencias: item.q,
                        };
                    })
                ).then(values => {
                    return res.send({ ok: true, qtd: values.length });
                });
            });
        });
    });

    return api;
};
