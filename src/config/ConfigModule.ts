import fs from 'fs';
import path from 'path';

type IConfig = {
  input: string;
  output: string;
  plugins: string;
  logPath: string;
  logLevel: string;
  verbose: boolean;
};

const defaultConfig: IConfig = {
  input: 'Input',
  output: 'Output',
  plugins: 'Plugins',
  logPath: 'Log',
  logLevel: 'info',
  verbose: false,
};

class Config {
  private config: IConfig;

  constructor() {
    this.config = defaultConfig;
  }

  init(v: boolean, logPath: string): Error | IConfig {
    const verbose = !!v;
    this.config.verbose = verbose;
    const fileExist = logPath && fs.existsSync(logPath);
    if (fileExist && fs.lstatSync(logPath).isDirectory()) {
      logPath = path.join(logPath, 'config.json');
    }
    if (fileExist && fs.existsSync(logPath)) {
      try {
        const configFromFile = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
        this.config = { ...this.config, ...configFromFile };
        this.config.verbose = verbose;
      } catch (e) {
        return e as Error;
      }
    } else {
      return new Error('Config file not found');
    }
    return this.config;
  }

  getConfig(): IConfig {
    return this.config;
  }
}

const ConfigModule = new Config();
export { ConfigModule, IConfig };
