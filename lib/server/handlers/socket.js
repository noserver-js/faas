const log = require('../../log');

module.exports = (io, methods) => {
  io.on('connection', socket => {
    log.message('connected');

    // -----
    socket.on('validation', options => {
      log.message('validation passed');

      socket.emit('validation complete', {
        methods: Object.keys(methods)
      });
    });

    // ----
    for (const method of Object.keys(methods)) {
      socket.on(method, ({props, uid}) => {
        log.info(`"${method}#${uid}" called`, props);

        const response = methods[method](props);

        socket.emit(`${method} done ${uid}`, {
          response
        });
      });
    }
  });
}
