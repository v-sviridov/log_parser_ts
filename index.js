const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { ConfigModule, logger, LoggerModule, readFile, initPlugins, Core } = require('./build');

function proceedCLI() {
  const args = yargs(hideBin(process.argv))
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .option('config', {
      alias: 'c',
      type: 'string',
      default: 'config.json',
      description: 'Set path to config file',
    })
    .parse();
  Core.init(args);
  Core.process();
}

proceedCLI();
