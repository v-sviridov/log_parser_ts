'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
Object.defineProperty(exports, '__esModule', { value: true });
const { logger } = require('../../build');
const fs = require('fs');

const initAnalyticsPlugins = (input) => {
  logger.info('Init Analytics plugins');
  let count = 0;
  const files = fs.readdirSync(__dirname).filter((fn) => fn.endsWith('plugin.js'));
  files.forEach((f) => {
    try {
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
