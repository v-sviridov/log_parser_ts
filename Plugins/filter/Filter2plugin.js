'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Logs4Plugin } = require('../../build');

class Example2 extends Logs4Plugin {
  getPluginName() {
    return 'FilterPlugin-#2';
  }

  configureOutput() {
    this.output.setTitle('This is Example #2 filter plugin title');
    this.output.printHeader();
  }

  outputService(obj, fileName, line) {
    if (obj.podName === 'tg-celestia-cbr49ce20d7s99haqjm0-validators-2') {
      this.output.printLine(line);
    }
  }
}
exports.default = Example2;
