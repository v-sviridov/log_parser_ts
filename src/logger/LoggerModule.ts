import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigModule, IConfig } from '../config';

const rotateOptions = {
  maxSize: '10m',
  maxFiles: '2d',
  filename: 'panoptes-%DATE%.log',
};

class Logger {
  private consoleTransport = new winston.transports.Console({ level: 'debug' });
  fileTransport(config: IConfig): DailyRotateFile {
    const level = config.logLevel in winston.config.syslog.levels ? config.logLevel : 'info';
    return new DailyRotateFile({
      level: level,
      dirname: config.logPath,
      zippedArchive: false,
      ...rotateOptions,
    });
  }

  private logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.printf((info) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      })
    ),
    transports: [this.consoleTransport],
  });

  init(): void {
    const config = ConfigModule.getConfig();
    if (!config.verbose) {
      this.logger.remove(this.consoleTransport);
    }
    this.logger.add(this.fileTransport(config));
  }

  getLogger(): winston.Logger {
    return this.logger;
  }
}
const LoggerModule = new Logger();
const logger = LoggerModule.getLogger();
export { LoggerModule, logger };
