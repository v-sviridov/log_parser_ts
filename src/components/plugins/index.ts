import { PluginCallbacks } from './BasePlugin';
import { Logs4Plugin } from './Logs4Plugin';
import { ReadFile } from '../input';
import { logger } from '../../logger';
import { ConfigModule } from '../../config';
import path from 'path';

const initPlugins = (input: ReadFile): void => {
  logger.info('Init plugins');
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { initAnalyticsPlugins } = require(path.join(
      process.cwd(),
      ConfigModule.getConfig().plugins,
      'analytics'
    ));
    const aPluginsCount = initAnalyticsPlugins(input);
    logger.info(`${aPluginsCount} analytics inited`);
  } catch (e) {
    logger.info(`No analytics plugins found`);
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { initFilterPlugins } = require(path.join(
      process.cwd(),
      ConfigModule.getConfig().plugins,
      'filter'
    ));
    const fPluginsCount = initFilterPlugins(input);
    logger.info(`${fPluginsCount} filter inited`);
  } catch (e) {
    logger.info(`No filter plugins found`);
  }
};
export { initPlugins, Logs4Plugin, PluginCallbacks };
