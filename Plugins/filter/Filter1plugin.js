'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Logs4Plugin, Logs4MsgType } = require('../../build');

class Example1 extends Logs4Plugin {
  getPluginName() {
    return 'FilterPlugin-#1';
  }

  configureOutput() {
    this.output.setTitle('This is Example #1 filter plugin title');
    this.output.printHeader();
  }

  outputService(obj, fileName, line) {
    if (obj.msgType === Logs4MsgType.POD_MSG_TYPE && obj.logLevel === 'ERR') {
      const lineNumber = `${this.inputFiles[fileName].fileNb}: ${this.inputFiles[fileName].lineNb}`;
      this.output.printLine(`${lineNumber} ${line} `);
    }
  }

  //  finalise() {}
}
exports.default = Example1;
