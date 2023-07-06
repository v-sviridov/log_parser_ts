import { IConfig } from '../../config';
import fs from 'fs';
import readline from 'readline';
import { logger } from '../../logger';
import { PluginCallbacks } from '../plugins';

class ReadFile {
  private config: IConfig;
  private files: string[] = [];
  private pluginCallbacks: PluginCallbacks[] = [];
  constructor(config: IConfig) {
    this.config = config;
  }

  getFileNames() {
    if (this.files.length === 0) {
      this.files = fs.readdirSync(this.config.input).filter((fn) => fn.endsWith('.log'));
    }
    return this.files;
  }

  registerCallbacks(callbacks: PluginCallbacks) {
    this.pluginCallbacks.push(callbacks);
  }

  async processLineByLine(file: string) {
    const filePath = `${this.config.input}/${file}`;
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    this.startFileCallbacks(file);

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      this.processLineCallbacks(line, file);
    }
    this.endFileCallbacks(file);
  }
  startFileCallbacks(fileName: string): void {
    logger.info(`-- Start parsing ${fileName} file --`);
    this.pluginCallbacks.forEach((plugin) => plugin.startFile(fileName));
  }
  endFileCallbacks(fileName: string): void {
    this.pluginCallbacks.forEach((plugin) => plugin.endFile(fileName));
    logger.info(`-- End parsing ${fileName} file --`);
  }
  processLineCallbacks(line: string, fileName: string): void {
    this.pluginCallbacks.forEach((plugin) => plugin.parseLine(line, fileName));
  }
  processFiles() {
    const files = this.getFileNames();
    files.forEach((file) => {
      this.processLineByLine(file);
    });
  }
}

export { ReadFile };
