const commander = require('commander');
const config = require('../package.json');
const info = require('./info');
const server = require('./server');

commander
   .usage('faas [command]');

commander
   .version(config.version);

commander
  .command('server [directory]')
  .option('-a, --access-key <access-key>', 'your env access key')
  .option('-p, --port <port>', 'listening port')
  .description('stat faas dev server')
  .action(server);

commander
  .command('info')
  .description('faas dev server')
  .action(info);

module.exports = () => {
  commander.parse(process.argv);
};
