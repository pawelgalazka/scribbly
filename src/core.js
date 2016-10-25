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
    // Prepare the middlewares chain
    let nextMiddlewares = []

    // Create the chain
    this.middlewares.reduceRight((prevMiddleware, currMiddleware) => {
      let boundCurrMiddleware = currMiddleware.bind(undefined, prevMiddleware)
      nextMiddlewares.push(boundCurrMiddleware)
      return boundCurrMiddleware
    }, doNothing)

    nextMiddlewares.reverse()

    // Run the chain
    if (nextMiddlewares[0]) {
      nextMiddlewares[0](level, message, extras)
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
