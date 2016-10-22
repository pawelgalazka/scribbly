/* eslint-env jest */
import log, { levels } from '../index'
import {
  enableWhen,
  externalLogger,
  fileStreamer,
  levelFilter,
  namespace
} from '../middlewares'

describe('middleware', () => {
  let logger, calls

  beforeEach(() => {
    logger = null
    calls = []
  })

  function registerCalls (next, level, message) {
    calls.push([level, message])
  }

  describe('enableWhen', () => {
    it('should log when enabled', () => {
      logger = log.use(enableWhen(true)).use(registerCalls)
      logger.info('test')
      expect(calls).toEqual([[20, 'test']])
    })

    it('should not log when disabled', () => {
      logger = log.use(enableWhen(false)).use(registerCalls)
      logger.info('test')
      expect(calls).toEqual([])
    })
  })

  describe('externalLogger', () => {
    it('should log to external logger', () => {
      let mLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn(),
        critical: jest.fn()
      }
      logger = log.use(externalLogger(mLogger))
      logger.debug('d')
      logger.info('i')
      logger.warning('w')
      logger.error('e')
      logger.critical('c')
      expect(mLogger.debug.mock.calls).toEqual([['d', undefined]])
      expect(mLogger.info.mock.calls).toEqual([['i', undefined]])
      expect(mLogger.warning.mock.calls).toEqual([['w', undefined]])
      expect(mLogger.error.mock.calls).toEqual([['e', undefined]])
      expect(mLogger.critical.mock.calls).toEqual([['c', undefined]])
    })
  })

  describe('fileStreamer', () => {
    let fakeFs

    beforeEach(() => {
      fakeFs = {
        writeFileSync: jest.fn()
      }
      logger = log.use(fileStreamer(fakeFs, './logs.txt')).use(registerCalls)
    })

    it('should write logs to a file', () => {
      logger.info('t1')
      logger.info('t2')
      expect(fakeFs.writeFileSync.mock.calls).toEqual([
        ['./logs.txt', 't1'],
        ['./logs.txt', 't2']
      ])
    })
  })

  describe('levelFilter', () => {
    beforeEach(() => {
      logger = log.use(levelFilter(levels.WARNING))
        .use(registerCalls)
    })

    it('should filter out logs with lower level', () => {
      logger.debug('d')
      logger.info('i')
      logger.warning('w')
      logger.error('e')
      expect(calls).toEqual([[30, 'w'], [40, 'e']])
    })
  })

  describe('namespace', () => {
    describe('when DEBUG global is undefined', () => {
      it('should not emit the log', () => {
        logger = log.use(namespace('n1')).use(registerCalls)
        logger.info('test message')
        expect(calls).toEqual([])
      })
    })

    describe('when DEBUG global is present', () => {
      let DEBUG

      beforeEach(() => {
        DEBUG = 'n1,n2:sub:*'
      })

      it('should emit the log with namespace name as a prefix', () => {
        logger = log.use(namespace('n1', '[{name}] ', DEBUG)).use(registerCalls)
        logger.info('test message')
        expect(calls).toEqual([[20, '[n1] test message']])
      })

      it('should emit the log when namespace name matches given wildcard', () => {
        logger = log.use(namespace('n2:sub:s1', '[{name}] ', DEBUG)).use(registerCalls)
        logger.info('test message')
        expect(calls).toEqual([[20, '[n2:sub:s1] test message']])
      })

      it('should pass any log when general wildcard given', () => {
        logger = log.use(namespace('n2:sub:s1', '[{name}] ', '*')).use(registerCalls)
        logger.info('test message')
        expect(calls).toEqual([[20, '[n2:sub:s1] test message']])
      })

      it('should emit the log with custom namespace prefix', () => {
        logger = log.use(namespace('n1', '{name}: ', DEBUG)).use(registerCalls)
        logger.info('test message')
        expect(calls).toEqual([[20, 'n1: test message']])
      })
    })
  })
})
