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
    const middlewares = this.middlewares.map((middleware, index, middlewares) => {
      return middleware.bind(middlewares[index + 1] || doNothing, level)
    })

    if (middlewares[1]) {
      middlewares[1](message, extras)
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
