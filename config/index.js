'use strict';
require('colors');
const util = require('../lib/util');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const validateEnv = (key, bomb) => {
  if(!process.env[key]) {
    if(bomb) {
      console.error('Warning'.red + ' ' + key + ' is required!');
      process.exit(1);
    }
    console.error('Warning'.yellow + ' ' + key + ' should really be set!');
    return null;
  }
  return process.env[key];
};

let config = {
  port: 5000,
  sessionSecret: validateEnv('HE_SESSION_SECRET', true),
  dal: {
    encryptionKey: validateEnv('HE_DAL_ENCRYPTION_KEY'),
    gzip: util.defaultValue(validateEnv('HE_DAL_GZIP')),
    redis: {
      host: 'localhost',
      port: 6379,
      password: validateEnv('HE_REDIS_PASSWORD')
    }
  }
};

const env = util.defaultValue(process.env.NODE_ENV, 'local');
const envConfigFile = `./${env}.js`;
if(env && fs.existsSync(path.join(__dirname, envConfigFile))) {
  const envConfig = require(envConfigFile);
  config = _.merge(config, envConfig);
} else {
  console.warn('Warning'.yellow + ' no environmental configuration found for environment: ' + env);
}
module.exports = config;
