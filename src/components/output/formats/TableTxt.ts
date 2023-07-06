import fs from 'fs';
import { logger } from '../../../logger';
const ROWS_LIMIT = 100000;

export class TableTxt {
  private header: string[] = [];
  private headerSize: number[] = [];
  private title = '';
  private rows: [string[]] = [[]];
  private output: fs.WriteStream;
  private tableLine = '';
  private sortField = '';
  private sortAscending = true;
  private tableHeaderPrinted = false;

  constructor(output: fs.WriteStream) {
    this.output = output;
  }

  addTitle(title: string) {
    this.title = title;
  }

  setSort(field: string, ascending = true) {
    this.sortField = field;
    this.sortAscending = ascending;
  }

  sortRows() {
    const fieldIndex = this.header.indexOf(this.sortField);
    if (!this.sortField || fieldIndex < 0) {
      return;
    }
    logger.info(`Sorting by ${this.sortField} ${this.sortAscending ? 'ascending' : 'descending'}`);
    this.rows.sort((a, b) => {
      const compareA = Number(a[fieldIndex]) || a[fieldIndex];
      const compareB = Number(b[fieldIndex]) || b[fieldIndex];
      if (this.sortAscending) {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  }

  setHeader(header: string[]) {
    this.header = header;
    header.forEach((h) => {
      this.headerSize.push(h.length > 4 ? h.length : 4);
    });
  }
  checkRowsLimit() {
    if (this.rows.length > ROWS_LIMIT) {
      this.printTable();
    }
  }

  addRow(row: string[]) {
    this.checkRowsLimit();
    this.rows.push(row);
    row.forEach((r, index) => {
      if (r.length > this.headerSize[index]) {
        this.headerSize[index] = r.length;
      }
    });
  }
  setTableLine() {
    let line = '+ ';
    this.header.forEach((h, index) => {
      line += `${'-'.padEnd(this.headerSize[index], '-')} + `;
    });
    this.tableLine = line;
  }
  printTableHeader() {
    let line = '| ';
    this.header.forEach((h, index) => {
      line += `${h.padEnd(this.headerSize[index])} | `;
    });
    this.output.write(`${this.tableLine}\r`);
    this.output.write(`${line}\r`);
    this.output.write(`${this.tableLine}\r`);
  }
  printTableRows() {
    this.sortRows();
    this.rows.forEach((row) => {
      let line = '| ';
      row.forEach((r: string, index: number) => {
        line += `${r.padEnd(this.headerSize[index])} | `;
      });
      this.output.write(`${line}\r`);
      this.output.write(`${this.tableLine}\r`);
    });
    this.rows = [[]];
  }
  printTable() {
    if (!this.tableHeaderPrinted) {
      this.output.write(`\r${this.title}\r`);
      this.setTableLine();
      this.printTableHeader();
      this.tableHeaderPrinted = true;
    }
    this.printTableRows();
  }
}
