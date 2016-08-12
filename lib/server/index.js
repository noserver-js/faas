const log = require('../log');

const server = require('./server');
const loadContext = require('./context');

const httpHandler = require('./handlers/http');
const socketHandler = require('./handlers/socket');

module.exports = (options = {
  port: 3001
}) => {

  loadContext().then(({context, methods}) => {
    const {app, io} = server({
      port: options.port
    });

    log.info(`server started at localhost:${options.port}`);

    log.info('available methods:');
    log.json(Object.keys(methods));

    log.info('app context:');
    log.json(context);

    socketHandler(io, methods);
    httpHandler(app, context, methods);

  }).catch(err => {
    console.log('cannot load context', err);
  });
};
