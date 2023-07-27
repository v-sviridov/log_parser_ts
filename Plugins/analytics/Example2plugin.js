'use strict';
'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
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
    this.podErrSummary = {};
  }
  addSummary(podName) {
    this.podErrSummary[podName] = this.podErrSummary[podName] ? this.podErrSummary[podName] + 1 : 1;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  outputService(obj, _fileName) {
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
