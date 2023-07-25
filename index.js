try {
  const yargs = require('yargs/yargs');
  const { hideBin } = require('yargs/helpers');
  const { Core } = require('./build');

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
} catch (e) {
  console.log('Build not found, run npm run build');
}
