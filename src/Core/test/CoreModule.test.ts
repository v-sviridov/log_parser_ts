// Import the Core class and other required modules
import { Core } from '../Core';

import { logger, LoggerModule } from '../../logger';
import { ConfigModule } from '../../config';
import { initPlugins } from '../../components/plugins';
import { ReadFile } from '../../components';

// Mock the logger methods to prevent actual console logging during tests
const mockInit = jest.fn();
jest.mock('../../logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
  LoggerModule: {
    init: jest.fn(),
  },
}));

// Mock the ConfigModule class to return a mock config object or an error based on the provided arguments
jest.mock('../../config', () => ({
  ConfigModule: {
    init: jest.fn((verbose, configPath) => {
      if (configPath === 'error_config.json') {
        return new Error('Invalid config file');
      }
      return {
        /* Mock config object */
      };
    }),
    getConfig: jest.fn(() => {
      return {
        /* Mock config object */
      };
    }),
  },
}));

// Mock the ReadFile class to prevent actual file processing during tests
const input = {
  processFiles: jest.fn(),
};
jest.mock('../../components', () => ({
  ReadFile: jest.fn().mockImplementation(() => input),
}));

jest.mock('../../components/plugins', () => ({
  initPlugins: jest.fn(),
}));

describe('Core', () => {
  beforeEach(() => {
    LoggerModule.init = mockInit;
  });

  afterEach(() => {
    mockInit.mockClear();
  });

  describe('init', () => {
    it('should initialize modules and log application init messages with provided config', () => {
      const args = {
        c: 'custom_config.json',
        v: true,
      };

      // Call the init method with custom arguments
      Core.init(args);

      // Check that ConfigModule.init was called with correct arguments
      expect(ConfigModule.init).toHaveBeenCalledWith(true, 'custom_config.json');

      // Check that LoggerModule.init was called once
      expect(LoggerModule.init).toHaveBeenCalledTimes(1);

      // Check that LoggerModule.info was called with the expected messages
      expect(logger.info).toHaveBeenCalledWith('//----');
      expect(logger.info).toHaveBeenCalledWith('//--  Start application');
      expect(logger.info).toHaveBeenCalledWith('//----');
      expect(logger.info).toHaveBeenCalledWith('Config file: custom_config.json, verbose: true');

      // Check that ReadFile was instantiated with the mock config object
      expect(ReadFile).toHaveBeenCalledWith({
        /* Mock config object */
      });

      // Check that initPlugins was called with the instantiated ReadFile object
      expect(initPlugins).toHaveBeenCalled();
    });

    it('should log an error message and use default config if ConfigModule.init returns an error', () => {
      const args = {
        c: 'error_config.json',
        v: false,
      };

      // Call the init method with arguments that will trigger an error in ConfigModule.init
      Core.init(args);

      // Check that ConfigModule.init was called with correct arguments
      expect(ConfigModule.init).toHaveBeenCalledWith(false, 'error_config.json');

      // Check that LoggerModule.error was called with the error message
      expect(logger.error).toHaveBeenCalledWith('******************************************');
      expect(logger.error).toHaveBeenCalledWith(
        '* Could not load config file: Invalid config file'
      );
      expect(logger.error).toHaveBeenCalledWith('* use default config');
      expect(logger.error).toHaveBeenCalledWith('******************************************');

      // Check that LoggerModule.init was called once (even with the error, we still call init for logging)
      expect(LoggerModule.init).toHaveBeenCalledTimes(1);

      // Check that LoggerModule.info was called with the expected messages
      expect(logger.info).toHaveBeenCalledWith('//----');
      expect(logger.info).toHaveBeenCalledWith('//--  Start application');
      expect(logger.info).toHaveBeenCalledWith('//----');
      expect(logger.info).toHaveBeenCalledWith('Config file: error_config.json, verbose: false');

      // Check that ReadFile was instantiated with the mock config object (default config)
      expect(ReadFile).toHaveBeenCalledWith({
        /* Mock config object */
      });

      // Check that initPlugins was called with the instantiated ReadFile object (default config)
      expect(initPlugins).toHaveBeenCalledWith(input);
    });
  });

  describe('process', () => {
    it('should call the processFiles method of ReadFile', () => {
      // Call the process method
      Core.process();

      // Check that the processFiles method of ReadFile was called
      expect(input.processFiles).toHaveBeenCalledTimes(1);
    });
  });
});
