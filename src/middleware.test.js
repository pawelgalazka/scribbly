/* eslint-env jest */
import log, { levels } from '../index'
import { levelFilter } from '../middleware'

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
})
