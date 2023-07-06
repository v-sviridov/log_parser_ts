import { PluginCallbacks } from './BasePlugin';
import { Logs4Plugin } from './Logs4Plugin';
import { ReadFile } from '../input';
import { logger } from '../../logger';
import { ConfigModule } from '../../config';
import path from 'path';

const initPlugins = (input: ReadFile): void => {
  logger.info('Init plugins');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initAnalyticsPlugins } = require(path.join(
    process.cwd(),
    ConfigModule.getConfig().plugins,
    'analytics'
  ));
  const pluginsCount = initAnalyticsPlugins(input);
  logger.info(`${pluginsCount} analytics inited`);
};
export { initPlugins, Logs4Plugin, PluginCallbacks };
