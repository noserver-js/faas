const chalk = require('chalk');

module.exports = {
  info: message => {
    console.log('');
    console.log(chalk.blue(message));
    console.log('');
  },
  message: message => console.log(message),
  debug: message => console.log(message),
  json: json => console.log(JSON.stringify(json, null, 4))
}
