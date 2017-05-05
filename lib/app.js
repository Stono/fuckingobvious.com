'use strict';
const Redis = require('./dal/redis/client');
const SessionStore = require('connect-redis')(require('express-session'));
const util = require('./util');
const config = require('../config');

module.exports = function App(options) {
  util.enforceArgs(options, ['dal', 'port'], true);
  util.enforceTypes(arguments, ['object', 'number']);

  const sessionRedis = new Redis(config.dal.redis);
  const sessionStore = new SessionStore({
    client: sessionRedis,
    prefix: 'session:',
    db: 1
  });
  const server = new require('./server')({
    port: options.port,
    sessionSecret: config.sessionSecret,
    sessionStore: sessionStore,
    dal: options.dal
  });

  let self = {};
  self.start = function(done) {
    server.start(done);
  };
  self.stop = function(done) {
    server.stop(done);
  };
  return Object.freeze(self);
};
