/* eslint-env jest */
import log, { levels } from '../index'
import { levelFilter } from '../middleware'

describe('middleware', () => {
  let logger

  describe('levelFilter', () => {
    let calls = []

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
})
