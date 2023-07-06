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
});
