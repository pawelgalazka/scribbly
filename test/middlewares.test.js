/* eslint-env jest */
import log from '../index'
import { levels } from '../core'
import {
  enableWhen,
  externalLogger,
  fileStreamer,
  levelFilter,
  namespace,
  timeFormatter
} from '../middlewares'

describe('middleware', () => {
  let logger, calls

  beforeEach(() => {
    logger = null
    calls = []
  })

  function registerCalls (next, level, message, extras) {
    calls.push([level, message, extras])
  }

  describe('enableWhen', () => {
    it('should log when enabled', () => {
      logger = log.use(enableWhen(true)).use(registerCalls)
      logger.info('test')
      expect(calls).toEqual([[20, 'test', undefined]])
    })

    it('should not log when disabled', () => {
      logger = log.use(enableWhen(false)).use(registerCalls)
      logger.info('test')
      expect(calls).toEqual([])
    })
  })

  describe('externalLogger', () => {
    let mLogger

    beforeEach(() => {
      mLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn(),
        critical: jest.fn()
      }
      logger = log.use(externalLogger(mLogger)).use(registerCalls)
    })

    it('should log to external logger', () => {
      logger.debug('d')
      logger.info('i', {a: 1})
      logger.warning('w')
      logger.error('e')
      logger.critical('c')
      expect(mLogger.debug.mock.calls).toEqual([['d']])
      expect(mLogger.info.mock.calls).toEqual([['i', {a: 1}]])
      expect(mLogger.warning.mock.calls).toEqual([['w']])
      expect(mLogger.error.mock.calls).toEqual([['e']])
      expect(mLogger.critical.mock.calls).toEqual([['c']])
    })

    it('should pass logs further', () => {
      logger.info('i', {a: 1})
      expect(calls).toEqual([[20, 'i', {a: 1}]])
    })
  })

  describe('fileStreamer', () => {
    let fakeFs

    beforeEach(() => {
      fakeFs = {
        appendFileSync: jest.fn()
      }
      logger = log.use(fileStreamer(fakeFs, './logs.txt')).use(registerCalls)
    })

    it('should write logs to a file', () => {
      logger.info('t1')
      logger.info('t2', {extras: 'abc'})
      expect(fakeFs.appendFileSync.mock.calls).toEqual([
        ['./logs.txt', 't1\n'],
        ['./logs.txt', 't2 {"extras":"abc"}\n']
      ])
    })

    it('should pass logs further', () => {
      logger.info('i', {a: 1})
      expect(calls).toEqual([[20, 'i', {a: 1}]])
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
      expect(calls).toEqual([[30, 'w', undefined], [40, 'e', undefined]])
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
        expect(calls).toEqual([[20, '[n1] test message', undefined]])
      })

      it('should emit the log when namespace name matches given wildcard', () => {
        logger = log.use(namespace('n2:sub:s1', '[{name}] ', DEBUG)).use(registerCalls)
        logger.info('test message')
        expect(calls).toEqual([[20, '[n2:sub:s1] test message', undefined]])
      })

      it('should pass any log when general wildcard given', () => {
        logger = log.use(namespace('n2:sub:s1', '[{name}] ', '*')).use(registerCalls)
        logger.info('test message')
        expect(calls).toEqual([[20, '[n2:sub:s1] test message', undefined]])
      })

      it('should emit the log with custom namespace prefix', () => {
        logger = log.use(namespace('n1', '{name}: ', DEBUG)).use(registerCalls)
        logger.info('test message')
        expect(calls).toEqual([[20, 'n1: test message', undefined]])
      })
    })
  })

  describe('timeFormatter', () => {
    beforeEach(() => {
      logger = log.use(timeFormatter).use(registerCalls)
    })

    it('should pass logs further with time annotation', () => {
      logger.info('i', {a: 1})
      expect(calls[0][0]).toEqual(20)
      expect(calls[0][1]).toMatch(/^\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{1,2}:\d{1,2} (AM|PM)\] i$/)
      expect(calls[0][2]).toEqual({a: 1})
    })
  })
})
