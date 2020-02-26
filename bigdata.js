const path = require('path');
const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');
const Promise = require('bluebird');

const directoryPath = path.join('livros');

const hashPalavras = {};
let contaPalavras = 0;

console.time('a');

fs.readdir(directoryPath, function(err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    Promise.each(files, (file, index) => {
        //console.log(index);

        return new Promise(resolve => {
            {
                let dis = 0;

                const rl = readline.createInterface({
                    input: fs.createReadStream(path.join('livros', file)),
                    crlfDelay: Infinity,
                });

                rl.on('line', line => {
                    switch (dis) {
                        case 1:
                            line = line.toLowerCase();

                            if (line.includes('end')) {
                                if (
                                    line.includes('***end') ||
                                    (line.includes('end') &&
                                        line.includes('project') &&
                                        line.includes('gutenberg')) ||
                                    (line.includes('end') &&
                                        line.includes('etext') &&
                                        line.includes('this'))
                                ) {
                                    dis = 2;
                                    break;
                                }
                            } else if (line.includes('<<this')) {
                                dis = 2;
                                break;
                            }

                            line = line.replace(/[^a-zA-Z0-9_-]/g, ' ');

                            const arr = line.split(' ');

                            for (let j = 0; j < arr.length; j++) {
                                const p = arr[j];

                                if (p.length < 1) {
                                    continue;
                                }
                                if (!hashPalavras[p]) {
                                    contaPalavras++;
                                    hashPalavras[p] = {
                                        p,
                                        q: 0,
                                    };
                                }
                                hashPalavras[p].q++;
                            }
                            break;
                        case 0:
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
                        console.log('Not END Disclaime ' + file);
                    }

                    resolve();
                });
            }
        });
    }).then(res => {
        console.log(_.orderBy(_.values(hashPalavras), 'q', 'desc'));
        console.timeEnd('a');
        console.log(contaPalavras);
        console.log('fim');
    });
});
