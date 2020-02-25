'use strict';

const express = require('express');

const fs = require('fs');
const _ = require('lodash');
const iconv = require('iconv-lite');

const jwt = require('jsonwebtoken');

module.exports = models => {
    const api = express.Router();

    api.get('/teste', (req, res) => {});

    return api;
};
