# scribbly ![node version](https://img.shields.io/node/v/scribbly.svg) [![Build Status](https://travis-ci.org/pawelgalazka/scribbly.svg?branch=master)](https://travis-ci.org/pawelgalazka/scribbly) [![npm version](https://badge.fury.io/js/scribbly.svg)](https://badge.fury.io/js/scribbly)

Scribbly it's a simple isomorphic logging tool which is based on middleware system. 
Management and construction of middlewares is very similar to the ones in *expressjs*. 
This allows broad flexibility and it keeps api simple.

## Quick start

Installation:

    npm install scribbly --save
    

Log messages to the console:

```javascript
import scribbly from 'scribbly'
import { namespace, consoleStream } from 'scribbly/middlewares'

const log = scribbly
  .use(namespace('moduleA'))
  .use(consoleStream)

const code = 101

log.info(`[${code}] test message`)
```

## Middlewares

For each logging, *scribbly* goes through a chain of middlewares in the same order how
they were defined by `use` method. Middlewares are just pure functions which can
modify the message (format), emit it to the console/file (stream) or prevent it from 
further emission to the rest of middlewares (filter). However they can actually do 
anything, they are just functions.

**Construction**

```javascript
const log = scribbly.use((next, level, message, extras) => {
  
  next(message, extras)
})
```

- `next` - {Function} calls the next middleware from the chain. If not called it breaks the chain.
- `level` - {Number} level of the log
- `message` - main message, can be a string or any other type
- `extras` - extra data, can be any type

Every time when `use` method is called it returns a new logger object with freshly defined
middleware and the middlewares from the previous logger. This have nice implications 
when in one module you can store the main logger, import it to other modules and
add new middlewares there if needed without any modifications to the original 
logger.

**Examples**

```javascript
import scribbly, { levels } from 'scribbly'

// Filter logs, passing the ones with >= minLevel
function levelFilter (minLevel) {
  return (next, level, message, extras) => {
    if (level >= minLevel) {
      next(level, message, extras)
    }
  }
}

const log = scribbly.use(levelFilter(levels.ERROR))
```

```javascript
import scribbly, { levels } from 'scribbly'

// Emit the log to the console
function consoleStream (next, level, message, extras) {
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

const log = scribbly.use(consoleStream)
```

Examples above are already predefined in `scribbly/middlewares` module.