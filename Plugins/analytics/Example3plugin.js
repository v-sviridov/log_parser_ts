'use strict';
const { Logs4Plugin, TableTxt, Logs4MsgType } = require('../../build');

class Example3 extends Logs4Plugin {
  getPluginName() {
    return 'ExamplePlugin-#3';
  }

  configureOutput() {
    this.output.setTitle('This is Example #1 plugin title');
    this.output.printHeader();
    this.table1 = new TableTxt(this.output.getOutput());
    this.table1.setHeader(['Line #', 'Time', 'LogLevel', 'Message', 'Payload']);
  }

  outputService(obj, fileName) {
    if (obj.msgType === Logs4MsgType.LOG_TYPE && obj.logLevel != 'DEBUG') {
      const lineNumber = `${this.inputFiles[fileName].fileNb}: ${this.inputFiles[fileName].lineNb}`;
      this.table1.addRow([lineNumber, obj.dateTime, obj.logLevel, obj.msg, obj.payload]);
    }
  }

  finalise() {
    this.table1.printTable();
  }
}
exports.default = Example3;
