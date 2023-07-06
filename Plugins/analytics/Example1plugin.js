'use strict';
const { Logs4Plugin, TableTxt, Logs4MsgType } = require('../../build');

class Example1 extends Logs4Plugin {
  getPluginName() {
    return 'ExamplePlugin-#1';
  }

  configureOutput() {
    this.output.setTitle('This is Example #1 plugin title');
    this.output.printHeader();
    this.table1 = new TableTxt(this.output.getOutput());
    this.table1.setHeader(['line #', 'PodName', 'Error Message', 'Time']);
  }

  outputService(obj, fileName) {
    if (obj.msgType === Logs4MsgType.POD_MSG_TYPE && obj.logLevel === 'ERR') {
      const lineNumber = `${this.inputFiles[fileName].fileNb}: ${this.inputFiles[fileName].lineNb}`;
      this.table1.addRow([lineNumber, obj.podName, obj.msg, obj.dateTime]);
    }
  }

  finalise() {
    this.table1.printTable();
  }
}
exports.default = Example1;
