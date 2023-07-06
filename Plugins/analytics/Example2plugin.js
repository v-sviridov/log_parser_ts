'use strict';
// Object.defineProperty(exports, "__esModule", { value: true });
const { Logs4Plugin, TableTxt, Logs4MsgType } = require('../../build');
class Example2 extends Logs4Plugin {
  getPluginName() {
    return 'ExamplePlugin-#2';
  }
  configureOutput() {
    this.output.setTitle('This is Example #2 plugin title');
    this.output.printHeader();
    this.table = new TableTxt(this.output.getOutput());
    this.table.setHeader(['PodName', 'Error Counts']);
    this.table.addTitle('Example of Table title. Pod Errors count.');
    this.table.setSort('Error Counts', false);
    //this.table2.setSort('PodName');
    this.podErrSummary = {};
  }
  addSummary(podName) {
    this.podErrSummary[podName] = this.podErrSummary[podName] ? this.podErrSummary[podName] + 1 : 1;
  }
  outputService(obj, fileName) {
    if (obj.msgType === Logs4MsgType.POD_MSG_TYPE && obj.logLevel === 'ERR') {
      this.addSummary(obj.podName);
    }
  }
  finalise() {
    for (const [key, value] of Object.entries(this.podErrSummary)) {
      this.table.addRow([key, value.toString()]);
    }
    this.table.printTable();
  }
}
exports.default = Example2;
