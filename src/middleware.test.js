/* eslint-env jest */
import log, { levels } from '../index'
import { levelFilter, consoleStreamer } from '../middleware'

describe('middleware', () => {
  let logger, calls

  describe('levelFilter', () => {
    beforeEach(() => {
      calls = []
      logger = log.use(levelFilter(levels.WARNING))
        .use((next, level) => {
          calls.push(level)
        })
    })

    it('should filter out logs with lower level', () => {
      logger.debug('d')
      logger.info('i')
      logger.warning('w')
      logger.error('e')
      expect(calls).toEqual([30, 40])
    })
  })

  describe('consoleStream', () => {
    beforeEach(() => {
      calls = []
      logger = log.use(consoleStreamer)
        .use((next, level) => {
          calls.push(level)
        })
    })

    it('should should log to console', () => {
      logger.debug('d', {})
      logger.info('i', {})
      logger.warning('w', {})
      logger.error('e', {})
      logger.critical('c', {})
    })
  })
})
