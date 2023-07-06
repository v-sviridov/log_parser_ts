import { ReadFile } from '../input';
import { logger } from '../../logger';

export type PluginCallbacks = {
  parseLine: (line: string, fileName: string) => void;
  startFile: (fileName: string) => void;
  endFile: (fileName: string) => void;
};
type InputFile = {
  [fileName: string]: {
    lineNb: number;
    fileNb: string;
  };
};

export abstract class BasePlugin {
  protected fileName = '';
  protected filesProcessing = 0;
  protected inputFiles: InputFile = {};

  protected constructor(input: ReadFile) {
    input.registerCallbacks({
      parseLine: this.parseLine.bind(this),
      startFile: this.startFile.bind(this),
      endFile: this.endFile.bind(this),
    });
  }
  endFile(fileName: string): void {
    delete this.inputFiles[fileName];
    this.filesProcessing--;
    logger.info(`${this.getPluginName()}: End parsing ${fileName} file --`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parseLine(line: string, fileName: string): void {
    this.inputFiles[fileName].lineNb++;
    this.processLine(line, fileName);
  }
  processLine(line: string, fileName: string): void {
    logger.debug(`Line ${this.inputFiles[fileName].fileNb}: ${line}`);
  }

  startFile(fileName: string): void {
    this.filesProcessing++;
    this.inputFiles[fileName] = { lineNb: 0, fileNb: `f#${this.filesProcessing}` };
    this.fileName = fileName;
    logger.info(`${this.getPluginName()}: Start parsing ${this.fileName} file --`);
    this.setOutput(`${this.inputFiles[fileName].fileNb}: ${fileName}`);
  }
  setOutput(fileName: string): void {
    logger.debug(`Configure output for file ${fileName}`);
  }
  getPluginName(): string {
    return 'BasePlugin';
  }
}
