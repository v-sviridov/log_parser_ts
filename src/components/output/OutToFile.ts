import fs from 'fs';
import stream from 'stream';
import path from 'path';
import { logger } from '../../logger';
import { ConfigModule } from '../../config';

export class OutToFile {
  private readonly output: fs.WriteStream;
  private title = '';
  private readonly pluginName: string;

  constructor(pluginName: string) {
    this.pluginName = pluginName;
    const outputDir = ConfigModule.getConfig().output;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const fileName = path.join(outputDir, `${pluginName}_${Date.now()}.txt`);
    this.output = fs.createWriteStream(fileName);
    this.promisify(this.output).then(() => {
      logger.info(`Output file done: ${fileName}`);
    });
  }

  setTitle(title: string) {
    this.title = title;
  }

  printInputFileName(fileName: string) {
    this.output.write(`Log file: ${fileName}\r`);
  }

  getOutput(): fs.WriteStream {
    return this.output;
  }

  promisify(s: stream.Stream): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const onClose = () => {
        s.off('error', onError);
        resolve();
      };
      const onError = (error: Error) => {
        s.off('close', onClose);
        reject(error);
      };

      s.once('close', onClose);
      s.once('error', onError);
    });
  }
  printHeader() {
    this.output.write(`${this.title}\r\r`);
    this.output.write(`Plugin: ${this.pluginName}\r\r`);
  }
  printLine(line: string) {
    this.output.write(`${line}\r`);
  }
}
