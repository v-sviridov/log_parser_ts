import { BasePlugin } from './BasePlugin';
import { ReadFile } from '../input';
import { Logs4Parser, ILogs4LogObj, IParser } from '../parser';
import { logger } from '../../logger';
import { OutToFile } from '../output';

export class Logs4Plugin extends BasePlugin {
  parser: IParser;
  output!: OutToFile;

  constructor(input: ReadFile) {
    super(input);
    this.parser = new Logs4Parser();
    logger.info('create Logs4 Plugin');
  }

  getPluginName(): string {
    return 'Logs4Plugin';
  }

  setOutput(fileName: string) {
    if (!this.output) {
      logger.info(` Use ${this.parser.getParserName()}`);
      this.output = new OutToFile(this.getPluginName());
      this.configureOutput();
    }
    this.output.printInputFileName(fileName);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configureOutput() {}

  endFile(fileName: string) {
    super.endFile(fileName);
    if (this.filesProcessing === 0) {
      this.finalise();
      this.output?.getOutput().end();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  finalise() {}

  processLine(line: string, fileName: string) {
    const logs4LogObj = this.parser.parseLine(line);
    this.outputService(logs4LogObj, fileName, line);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  outputService(_obj: ILogs4LogObj, _fileName: string, _line: string): void {
    logger.debug('Logs4Plugin outputService');
  }
}
