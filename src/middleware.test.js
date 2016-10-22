/* eslint-env jest */
import log, { levels } from '../index'
import { enableWhen, externalLogger, levelFilter, namespace } from '../middleware'

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
    it('should add namespace name before the message', () => {
      logger = log.use(namespace('n1'))
        .use(registerCalls)
      logger.info('test message')
      expect(calls).toEqual([[20, '[n1] test message']])
    })

    it('should add namespace name with custom format', () => {
      logger = log.use(namespace('n1', '{name}: '))
        .use(registerCalls)
      logger.info('test message')
      expect(calls).toEqual([[20, 'n1: test message']])
    })
  })
})
