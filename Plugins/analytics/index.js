'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// const { ExamplePlugin3 } = require('./ExamplePlugin3');
const { logger } = require('../../build');
const fs = require('fs');

const readPluginFiles = () => {
  let plugins = [];
  const files = fs.readdirSync(__dirname).filter((fn) => fn.endsWith('plugin.js'));
  files.forEach((f) => {
    try {
      const f2 = f.replace('.js', '');
      const plugin = require('./' + f2);
      plugins.push(plugin);
    } catch (e) {
      console.log(e);
      logger.error(`Error on read ${f} plugin`, e);
    }
  });
  return plugins;
};
const initAnalyticsPlugins = (input) => {
  logger.info('Init Analytics plugins');
  let count = 0;
  const files = fs.readdirSync(__dirname).filter((fn) => fn.endsWith('plugin.js'));
  files.forEach((f) => {
    try {
      // const f2 = f.replace('.js', '');
      const plugin = require('./' + f.replace('.js', ''));
      const pl = new plugin.default(input);
      logger.info(`Plugin ${pl.getPluginName()} init OK`);
      count++;
    } catch (e) {
      logger.error('Error on init analytics plugins ', e);
    }
  });
  return count;
};
exports.initAnalyticsPlugins = initAnalyticsPlugins;
