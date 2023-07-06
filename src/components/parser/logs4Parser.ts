import { logger } from '../../logger';
import { Logs4MsgType, ILogs4LogObj, Logs4LogMsgStruct, IParser } from './interfaces';

class Logs4Parser implements IParser {
  // eslint-disable-next-line no-control-regex
  private re = /\[(1;)*\d*m/g;
  getParserName(): string {
    return 'Logs4 parser';
  }
  parseLine(line: string): ILogs4LogObj {
    const result: ILogs4LogObj = {
      lineNum: 0,
      msgType: Logs4MsgType.UNKNOWN_TYPE,
      timestamp: 0,
      dateTime: '',
      logLevel: '',
      msg: '',
      podName: '',
      payload: '',
      payloadObj: {},
    };
    // line = line.replace(re, '').trim();
    const logMsgSplited = line.split('\t');
    if (logMsgSplited.length >= Logs4LogMsgStruct.PAYLOAD) {
      // source string: Aug 12 12:17:22.737467
      // destination string: 11.10.2012 08:54:41.545
      const year = new Date().getFullYear();
      const logTimestamp = Date.parse(`${year} ${logMsgSplited[Logs4LogMsgStruct.DATETIME]}`);
      // const a = new Date(logTimestamp);
      // var dateFormat = require('dateformat');
      // dateFormat(a, "dddd, mmmm, yyyy, h:MM:ss.TT");
      return {
        ...result,
        msgType: Logs4MsgType.LOG_TYPE,
        timestamp: logTimestamp,
        dateTime: logMsgSplited[Logs4LogMsgStruct.DATETIME],
        logLevel: logMsgSplited[Logs4LogMsgStruct.LOG_LEVEL].replace(this.re, '').trim(),
        msg: logMsgSplited[Logs4LogMsgStruct.MESSAGE].replace(this.re, '').trim(),
        payload:
          logMsgSplited.length > Logs4LogMsgStruct.PAYLOAD
            ? logMsgSplited[Logs4LogMsgStruct.PAYLOAD]
            : '',
      };
    } else {
      const podMsgSplited = line.split(' | ');
      if (podMsgSplited.length > 1) {
        const podName = podMsgSplited[0].trim();
        const payload = podMsgSplited[1].trim();
        return {
          ...result,
          msgType: Logs4MsgType.POD_JSON_TYPE,
          podName: podName,
          ...this.parsePodMessage(payload),
        };
      } else {
        logger.debug('Cannot interpret this line: ', line);
        return {
          ...result,
          msg: line,
        };
      }
    }
  }
  parsePodMessage(payload: string): any {
    if (payload.startsWith('{')) {
      return { payload };
    } else {
      const result = {
        msgType: Logs4MsgType.POD_MSG_TYPE,
      };
      // eslint-disable-next-line no-control-regex
      const re2 = /\[[1-9]\d*m/g;
      const podLogParts = payload
        .split(re2)
        .filter((e) => !!e)
        .map((m) => m?.replace(this.re, '').trim());
      if (podLogParts.length >= 2) {
        result['dateTime'] = podLogParts[0];
        const levelAndMessage = podLogParts[1].split(' ');
        result['logLevel'] = levelAndMessage[0];
        result['msg'] = levelAndMessage.slice(1).join(' ');
      }
      if (podLogParts.length > 2) {
        result['payloadObj'] = {};
        const payloadKeyValue = podLogParts.slice(2);
        result['payload'] = payloadKeyValue.join(',');
        payloadKeyValue.forEach((part) => {
          if (part.includes('=')) {
            const [key, value] = part.split('=');
            result['payloadObj'][key] = value;
          } else {
            result['payloadObj'][part] = part;
          }
        });
      }
      if (podLogParts.length === 1) {
        result['msg'] = podLogParts[0];
      }
      return result;
    }
  }

  static parseLogPayload(payload: string): any {
    // parsing json line like this:
    //{"runner": "cluster:k8s", "run_id": "cbr49ce20d7s99haqjm0", "running_for": "2s", "succeeded": 0, "running": 0, "pending": 40, "failed": 0, "unknown": 0}
    try {
      return JSON.parse(payload);
    } catch (e) {
      logger.error('Error parsing payload: ', e);
      return {};
    }
  }
  static parsePodPayload(payload: string): any {
    // parsing json line like this:
    //{"ts":1660306667130395760,"msg":"","group_id":"validators","run_id":"cbr49ce20d7s99haqjm0","event":{"message_event":{"message":"/.celestia-app-37"}}}
    try {
      return JSON.parse(payload);
    } catch (e) {
      logger.error('Error parsing podPayload: ', e);
      return {};
    }
  }
}
export { Logs4Parser };
