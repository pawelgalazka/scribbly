/* eslint-env jest */
import { CoreLogger } from '../lib/index'

describe('CoreLogger', () => {
  describe('without any middleware', () => {
    let logger

    beforeEach(() => {
      logger = new CoreLogger()
    })

    it('should do nothing', () => {
      logger.log(10, 'test message')
    })

    it('should have no middlewares', () => {
      expect(logger.middlewares).toEqual([])
    })

    it('should be immutable', () => {
      expect(() => {
        logger.middlewares.push(() => {})
      }).toThrowError(/object is not extensible/)
      logger.use(() => {})
      expect(logger.middlewares).toEqual([])
    })
  })

  describe('with middleware', () => {
    it('should be able to filter out the logs', () => {
      let calls = []
      const logger = new CoreLogger()
        .use((next, level, message, extras) => {
          calls.push([level, message, extras])
          next(message, extras)
        })
        .use((next, level, message, extras) => {
          calls.push([level, message, extras])
          next(message, extras)
        })
        .use((next, level, message, extras) => {
          calls.push([level, message, extras])
        })

      logger.log(10, 'test msg', 'extras')
      expect(calls).toEqual([
        [10, 'test msg', 'extras'],
        [10, 'test msg', 'extras']
      ])
    })

    it('should be able to format the logs', () => {
      let calls = []
      const logger = new CoreLogger()
        .use((next, level, message, extras) => {
          message = '[note] ' + message
          calls.push([level, message, extras])
          next(message, extras)
        })
        .use((next, level, message, extras) => {
          message = message + ' [suffix]'
          calls.push([level, message, extras])
          next(message, extras)
        })

      logger.log(10, 'test msg', 'extras')
      expect(calls).toEqual([
        [10, '[note] test msg', 'extras'],
        [10, '[note] test msg [suffix]', 'extras']
      ])
    })
  })
})
