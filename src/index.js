function doNothing () {

}

export const levels = {
  DEBUG: 10,
  INFO: 20,
  WARNING: 30,
  ERROR: 40,
  CRITICAL: 50
}

export class CoreLogger {
  constructor (middlewares = []) {
    this.middlewares = Object.freeze(middlewares)
  }

  log (level, message, extras) {
    let middlewares = this.middlewares.slice()
    let nextMiddlewares = []
    middlewares.reverse()
    middlewares.forEach((middleware) => {
      if (nextMiddlewares.length) {
        nextMiddlewares.push(middleware.bind(undefined, nextMiddlewares[nextMiddlewares.length - 1], level))
      } else {
        nextMiddlewares.push(middleware.bind(undefined, doNothing, level))
      }
    })
    nextMiddlewares.reverse()

    if (nextMiddlewares[0]) {
      nextMiddlewares[0](message, extras)
    }
  }

  use (middleware) {
    return new Logger(this.middlewares.concat(middleware))
  }
}

export class Logger extends CoreLogger {
  debug (message, extras) {
    this.log(levels.DEBUG, message, extras)
  }

  info (message, extras) {
    this.log(levels.INFO, message, extras)
  }

  warning (message, extras) {
    this.log(levels.WARNING, message, extras)
  }

  error (message, extras) {
    this.log(levels.ERROR, message, extras)
  }

  critical (message, extras) {
    this.log(levels.CRITICAL, message, extras)
  }
}

export const log = new Logger()

export default log
