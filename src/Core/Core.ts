import { logger, LoggerModule } from '../logger';
import { ConfigModule } from '../config';
import { initPlugins } from '../components/plugins';
import { ReadFile } from '../components';

export class Core {
  static input: ReadFile;

  static init(args: { v: boolean; c: string }) {
    const config = ConfigModule.init(args.v, args.c); // should be first
    // console transport is enabled, so we can log application init messages to console
    if (config instanceof Error) {
      logger.error(`******************************************`);
      logger.error(`* Could not load config file: ${config.message}`);
      logger.error('* use default config');
      logger.error(`******************************************`);
    }
    LoggerModule.init(); // if verbose is false, console logger will be disabled
    logger.info('//----');
    logger.info('//--  Start application');
    logger.info('//----');
    logger.info(`Config file: ${args.c}, verbose: ${!!args.v}`);
    Core.input = new ReadFile(ConfigModule.getConfig());
    // // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const { initAnalyticsPlugins } = require(path.join(
    //   process.cwd(),
    //   ConfigModule.getConfig().plugins,
    //   'analytics'
    // ));
    initPlugins(Core.input);
    // const pluginsCount = initAnalyticsPlugins(Core.input);
    // logger.info(`${pluginsCount} analytics inited`);
  }
  static process() {
    Core.input.processFiles();
  }
}
