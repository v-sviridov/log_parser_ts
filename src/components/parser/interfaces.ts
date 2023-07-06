export enum Logs4MsgType {
  LOG_TYPE,
  POD_JSON_TYPE,
  POD_MSG_TYPE,
  UNKNOWN_TYPE,
}

export enum Logs4LogMsgStruct {
  DATETIME,
  LOG_LEVEL,
  MESSAGE,
  PAYLOAD,
}

export type ILogs4LogObj = {
  lineNum: number;
  msgType: Logs4MsgType;
  timestamp: number;
  dateTime: string;
  logLevel: string;
  msg: string;
  podName: string;
  payload: string;
  payloadObj: any;
};

export type IParsedObj = ILogs4LogObj;

export type IParser = {
  parseLine(line: string): IParsedObj;
  getParserName(): string;
};
