import { ConfigModule, IConfig } from '../ConfigModule';

const defaultConfig: IConfig = {
  input: 'Input',
  output: 'Output',
  plugins: 'Plugins',
  logPath: 'Log',
  logLevel: 'info',
  verbose: false,
};

describe('ConfigModule', () => {
  it('should return default config', () => {
    const config = ConfigModule.getConfig();
    expect(config).toEqual(defaultConfig);
  });
  it('should return config with verbose true', () => {
    ConfigModule.init(true, '');
    const config = ConfigModule.getConfig();
    expect(config).toEqual({ ...defaultConfig, verbose: true });
  });
  it('should return config from config file', () => {
    const configPath = `${__dirname}/config.json`;
    ConfigModule.init(false, configPath);
    const config = ConfigModule.getConfig();
    expect(config).toEqual({ ...defaultConfig, verbose: false, logLevel: 'debug' });
  });
  it('should return config from config file and verbose true', () => {
    const configPath = `${__dirname}/config.json`;
    ConfigModule.init(true, configPath);
    const config = ConfigModule.getConfig();
    expect(config).toEqual({ ...defaultConfig, verbose: true, logLevel: 'debug' });
  });
});
