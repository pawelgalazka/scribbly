import { levels } from './index'

export function enableWhen (isOn) {
  return (next, level, message, extras) => {
    if (isOn) {
      next(message, extras)
    }
  }
}

export function levelFilter (minLevel) {
  return (next, level, message, extras) => {
    if (level >= minLevel) {
      next(message, extras)
    }
  }
}

export function consoleStreamer (next, level, message, extras) {
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
