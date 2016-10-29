/* eslint-env jest */
import { CoreLogger } from '../core'

describe('CoreLogger', () => {
  let calls, logger

  beforeEach(() => {
    calls = []
    logger = new CoreLogger()
  })

  it('should have no middlewares by default', () => {
    expect(logger.middlewares).toEqual([])
  })

  it('should be immutable', () => {
    expect(() => {
      logger.middlewares.push(() => {})
    }).toThrowError(/object is not extensible/)
    logger.use(() => {})
    expect(logger.middlewares).toEqual([])
  })

  describe('with middleware', () => {
    it('should call middlewares in a right order', () => {
      logger = logger
        .use((next) => {
          calls.push(1)
          next()
        })
        .use((next) => {
          calls.push(2)
          next()
        })
        .use((next) => {
          calls.push(3)
          next()
        })
        .use((next) => {
          calls.push(4)
          next()
        })
      logger.info('test')
      expect(calls).toEqual([1, 2, 3, 4])
    })

    it('should be able to filter out the logs', () => {
      logger = logger
        .use((next, level, message, extras) => {
          calls.push([level, message, extras])
          next(level, message, extras)
        })
        .use((next, level, message, extras) => {
          calls.push([level, message, extras])
        })
        .use((next, level, message, extras) => {
          calls.push([level, message, extras])
        })

      expect(logger.middlewares.length).toEqual(3)
      logger.log(10, 'test msg', 'extras')
      expect(calls).toEqual([
        [10, 'test msg', 'extras'],
        [10, 'test msg', 'extras']
      ])
    })

    it('should be able to format the logs', () => {
      logger = logger
        .use((next, level, message, extras) => {
          message = '[note] ' + message
          calls.push([level, message, extras])
          next(level, message, extras)
        })
        .use((next, level, message, extras) => {
          message = message + ' [suffix]'
          calls.push([level, message, extras])
          next(level, message, extras)
        })

      expect(logger.middlewares.length).toEqual(2)
      logger.log(10, 'test msg', 'extras')
      expect(calls).toEqual([
        [10, '[note] test msg', 'extras'],
        [10, '[note] test msg [suffix]', 'extras']
      ])
    })
  })
})
