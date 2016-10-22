import { levels } from './index'
import escapeRegExp from 'lodash.escaperegexp'

function wildcard (pattern, name) {
  pattern = escapeRegExp(pattern)
  pattern = pattern.replace(/\\\*/g, '.*')
  pattern = new RegExp(pattern, 'g')
  return pattern.test(name)
}

export function consoleStreamer (next, level, message, extras) {
  let args = [message]
  if (extras) {
    args.push(extras)
  }

  switch (level) {
    case levels.DEBUG:
      console.log(...args)
      break
    case levels.INFO:
      console.log(...args)
      break
    case levels.WARNING:
      console.warn(...args)
      break
    case levels.ERROR:
      console.error(...args)
      break
    case levels.CRITICAL:
      console.error(...args)
      break
  }
  next(message, extras)
}

export function enableWhen (isOn) {
  return (next, level, message, extras) => {
    if (isOn) {
      next(message, extras)
    }
  }
}

export function externalLogger (logger) {
  return (next, level, message, extras) => {
    let args = [message]
    if (extras) {
      args.push(extras)
    }

    switch (level) {
      case levels.DEBUG:
        logger.debug(...args)
        break
      case levels.INFO:
        logger.info(...args)
        break
      case levels.WARNING:
        logger.warning(...args)
        break
      case levels.ERROR:
        logger.error(...args)
        break
      case levels.CRITICAL:
        logger.critical(...args)
        break
    }
    next(message, extras)
  }
}

export function fileStreamer (fs, path) {
  return (next, level, message, extras) => {
    let messageToFile = message
    if (extras) {
      messageToFile += ' ' + JSON.stringify(extras)
    }
    fs.writeFileSync(path, messageToFile)
    next(message, extras)
  }
}

export function levelFilter (minLevel) {
  return (next, level, message, extras) => {
    if (level >= minLevel) {
      next(message, extras)
    }
  }
}

export function namespace (name, format = '[{name}] ', debug) {
  // Reading DEBUG global in an isomorphic manner
  if (typeof process !== 'undefined' && process.env && process.env.DEBUG) {
    debug = process.env.DEBUG
  } else if (typeof window !== 'undefined' && window.DEBUG) {
    debug = window.DEBUG
  }

  const allowedNamespaces = debug ? debug.split(',') : []
  const matcher = (wildcardString) => {
    return wildcard(wildcardString, name)
  }

  return (next, level, message, extras) => {
    if (allowedNamespaces.some(matcher)) {
      const prefix = format.replace(/\{name\}/g, name)
      next(`${prefix}${message}`, extras)
    }
  }
}

export function timeFormatter (next, level, message, extras) {
  let time = (new Date()).toLocaleString()
  next(`[${time}] ${message}`, extras)
}
