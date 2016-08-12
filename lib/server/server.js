const http = require('http');
const koa = require('koa');
const socket = require('socket.io');

module.exports = (options = {
  port: 3000
}) => {
  const app = koa();
  const server = http.createServer(app.callback()).listen(options.port);
  const io = socket(server);

  return {app, io};
};
