import { Logs4Parser } from '../Logs4Parser';
import { Logs4MsgType, ILogs4LogObj } from '../interfaces';

const defaultResult: ILogs4LogObj = {
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

describe('Logs4 Parser tests:', () => {
  const parser = new Logs4Parser();
  const year = new Date().getFullYear();
  it('should return default result with message', () => {
    const line = '>>> Server output:';
    const result = parser.parseLine(line);
    expect(result).toEqual({ ...defaultResult, msg: line });
  });
  it('should return parsed log message without payload', () => {
    const line = 'Aug 12 12:17:22.737259\t[33mWARN[0m\t[1;33msome healthchecks failed, but continuing[0m';
    const logTimestamp = Date.parse(`${year} Aug 12 12:17:22.737259`);
    const result = parser.parseLine(line);
    expect(result).toEqual({
      ...defaultResult,
      logLevel: 'WARN',
      dateTime: 'Aug 12 12:17:22.737259',
      timestamp: logTimestamp,
      msgType: Logs4MsgType.LOG_TYPE,
      msg: 'some healthchecks failed, but continuing',
    });
  });
  it('should return parsed log message with payload', () => {
    const line =
      'Aug 12 12:16:16.420622\t[34mINFO[0m\ttestground client initialized\t{"addr": "http://localhost:8042"}';
    const logTimestamp = Date.parse(`${year} Aug 12 12:16:16.420622`);
    const result = parser.parseLine(line);
    expect(result).toEqual({
      ...defaultResult,
      logLevel: 'INFO',
      dateTime: 'Aug 12 12:16:16.420622',
      timestamp: logTimestamp,
      msgType: Logs4MsgType.LOG_TYPE,
      msg: 'testground client initialized',
      payload: '{"addr": "http://localhost:8042"}',
    });
  });
  it('should return parsed pod log with payload', () => {
    const line =
      'tg-celestia-cbr49ce20d7s99haqjm0-validators-22 | {"ts":1660306654725176559,"msg":"","group_id":"validators","run_id":"cbr49ce20d7s99haqjm0","event":{"message_event":{"message":"waiting for network to initialize"}}}';
    const result = parser.parseLine(line);
    expect(result).toEqual({
      ...defaultResult,
      msgType: Logs4MsgType.POD_JSON_TYPE,
      podName: 'tg-celestia-cbr49ce20d7s99haqjm0-validators-22',
      payload:
        '{"ts":1660306654725176559,"msg":"","group_id":"validators","run_id":"cbr49ce20d7s99haqjm0","event":{"message_event":{"message":"waiting for network to initialize"}}}',
    });
  });
  it('should return parsed pod log with message and payload', () => {
    const line =
      'tg-celestia-cbr49ce20d7s99haqjm0-validators-22 | [90m12:17PM[0m [32mINF[0m service start [36mconnection=[0mmempool [36mimpl=[0mlocalClient [36mmodule=[0mabci-client [36mmsg=[0m{}';
    const result = parser.parseLine(line);
    expect(result).toEqual({
      ...defaultResult,
      msgType: Logs4MsgType.POD_MSG_TYPE,
      logLevel: 'INF',
      dateTime: '12:17PM',
      msg: 'service start',
      podName: 'tg-celestia-cbr49ce20d7s99haqjm0-validators-22',
      payload: 'connection=mempool,impl=localClient,module=abci-client,msg={}',
      payloadObj: {
        connection: 'mempool',
        impl: 'localClient',
        module: 'abci-client',
        msg: '{}',
      },
    });
  });
  it('should return parsed pod log message without payload', () => {
    const line =
      'tg-celestia-cbr49ce20d7s99haqjm0-validators-22 | [90m12:17PM[0m [32mINF[0m starting node with ABCI Tendermint in-process';
    const result = parser.parseLine(line);
    expect(result).toEqual({
      ...defaultResult,
      msgType: Logs4MsgType.POD_MSG_TYPE,
      logLevel: 'INF',
      dateTime: '12:17PM',
      msg: 'starting node with ABCI Tendermint in-process',
      podName: 'tg-celestia-cbr49ce20d7s99haqjm0-validators-22',
    });
  });
  it('should return parsed pod log message without dataTime, logLevel and payload', () => {
    const line =
      'tg-celestia-cbr49ce20d7s99haqjm0-validators-22 | It is the only way to recover your account if you ever forget your password.';
    const result = parser.parseLine(line);
    expect(result).toEqual({
      ...defaultResult,
      msgType: Logs4MsgType.POD_MSG_TYPE,
      msg: 'It is the only way to recover your account if you ever forget your password.',
      podName: 'tg-celestia-cbr49ce20d7s99haqjm0-validators-22',
    });
  });
});
