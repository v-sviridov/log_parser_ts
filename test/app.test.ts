import { Core, ConfigModule, IConfig } from '../src';

//const { Core, ConfigModule } = require('../build');

const defaultConfig: IConfig = {
  input: 'Input',
  output: 'Output',
  plugins: 'Plugins',
  logPath: 'Log',
  logLevel: 'info',
  verbose: false,
};

describe('Core', () => {
  describe('init', () => {
    it('should set default config path and verbose option if not provided', () => {
      // Call the init method without any arguments
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Core.init({});

      // Check that the configPath and verbose options are set to default values
      const config = ConfigModule.getConfig();
      // Check that the config and verbose options are set correctly
      expect(config).toEqual(defaultConfig);
    });

    it('should set config path and verbose option', () => {
      const args = {
        c: './test/custom_config.json',
        v: true,
      };

      // Call the init method with custom arguments
      Core.init(args);
      const config = ConfigModule.getConfig();
      // Check that the config and verbose options are set correctly
      expect(config).toEqual({ ...defaultConfig, logLevel: 'debug', verbose: true });
    });
  });
});
