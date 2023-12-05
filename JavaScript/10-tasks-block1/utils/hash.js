'use strict';

const crypto = require('node:crypto');
const { hash: config } = require('../.config/app');

const hash = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(config.bytesLen).toString('base64');
  crypto.scrypt(password, salt, config.keyLen, (err, result) => {
    if (err) reject(err);
    resolve(salt + ':' + result.toString('base64'));
  });
});

module.exports = hash;
