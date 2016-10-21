export function levelFilter (minLevel) {
  return (next, level, message, extras) => {
    if (level >= minLevel) {
      next(level, message, extras)
    }
  }
}

export function consoleStream (next, level, message, extras) {

}
