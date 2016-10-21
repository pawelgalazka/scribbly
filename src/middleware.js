import { levels } from './index'

export function levelFilter (minLevel) {
  return (next, level, message, extras) => {
    if (level >= minLevel) {
      next(level, message, extras)
    }
  }
}

export function consoleStream (next, level, message, extras) {
  switch (level) {
    case levels.DEBUG:
      console.log(message, extras)
      break
    case levels.INFO:
      console.log(message, extras)
      break
    case levels.WARNING:
      console.warn(message, extras)
      break
    case levels.ERROR:
      console.error(message, extras)
      break
    case levels.CRITICAL:
      console.error(message, extras)
      break
  }
  next(level, message, extras)
}
