'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = (sequelize, Sequelize) => {
    const dirs = fs.readdirSync(__dirname, {});

    const models = dirs
        .filter(dir => {
            return fs.lstatSync(path.join(__dirname, dir)).isDirectory();
        })
        .reduce((obj, dir) => {
            const files = fs.readdirSync(path.join(__dirname, dir), {});

            files
                .filter(file => {
                    return file.slice(-3) === '.js';
                })
                .forEach(file => {
                    _.assign(
                        obj,
                        require(path.join(__dirname, dir, file))(
                            sequelize,
                            Sequelize
                        )
                    );
                });

            return obj;
        }, {});

    _.keys(models).map(key => {
        console.log(models[key]);
        if ('associate' in models[key]) {
            models[key].associate(models);
        }
    });

    return models;
};
