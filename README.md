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

Output:

    [moduleA] [101] test message
    
Keep in mind that without any middleware scribbly actually won't do anything and without
streaming middleware logs won't be emitted or written.

## Middlewares

For each logging, *scribbly* goes through a chain of middlewares in the same order how
they were defined by `use` method. Middlewares are just pure functions which can
modify the message (format), emit it to the console/file (stream) or prevent it from 
further emission to the rest of the chain (filter). However they can actually do 
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

**Immutability**

Every time when `use` method is called it returns a new logger object with freshly defined
middleware and the middlewares from the previous logger. This have nice implications 
when in one module you can store the main logger, import it to other modules and
add new middlewares there if needed without any modifications to the original 
logger.

## Predefined middlewares

```javascript
import { ... } from 'scribbly/middlewares'
```

**consoleStream**

Emit log to the output using `console.log`, `console.warn` or `console.error` depend on log
level.

    scribbly.use(consoleStream)
    
    
**levelFilter**

It passes only logs which are equal or higher than given level.

```
import scribbly, { levels } from 'scribbly'

scribbly.use(levelFilter(levels.ERROR))
```
    
    
## Api