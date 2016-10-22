# scribbly ![node version](https://img.shields.io/node/v/scribbly.svg) [![Build Status](https://travis-ci.org/pawelgalazka/scribbly.svg?branch=master)](https://travis-ci.org/pawelgalazka/scribbly) [![npm version](https://badge.fury.io/js/scribbly.svg)](https://badge.fury.io/js/scribbly)

Scribbly is a simple isomorphic logging tool which is based on middleware system. 
Management and construction of middlewares is very similar to the ones in *expressjs*. 
This allows broad flexibility and it keeps api simple.

- [Quick start](#quick-start)
- [Middlewares](#middlewares)
- [Predefined middlewares](#predefined-middlewares)
  - [consoleStreamer](#consolestreamer)
  - [enableWhen](#enablewhenison)
  - [externalLogger](#externalloggerlogger)
  - [fileStreamer](#filestreamerfilepath)
  - [levelFilter](#levelfilterminlevel)
  - [namespace](#namespacename-format--name-)
  - [timeFormatter](#timeformatter)

- [Recipes](#recipes)
  - [Production and development logging](#production-and-development-logging)
- [Api](#api)
  - [Logger](#logger)
  - [levels](#levels)

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
modify the message (formatter), emit it to the console/file (streamer) or prevent it from 
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
- `extras` - optional extra data, can be any type

**Immutability**

Every time when `use` method is called it returns a new logger object with freshly defined
middleware and the middlewares from the previous logger. This have nice implications 
when in one module you can store the main logger, import it to other modules and
add new middlewares there if needed without any modifications to the original 
logger.

**Order**

We can distinguish 3 types of middleware: *filter, formatter and streamer*. Order in which
those are applied is very important. If *streamer* will be added earlier than
*filter* or *formatter* it means that those 2 will have no effect on the log emission
through the *streamer*. Unless it is intended it is a good practice to add streamers
as the last ones to the middlewares chain.

## Predefined middlewares

```javascript
import { ... } from 'scribbly/middlewares'
```

#### consoleStreamer

Emit log to the output using `console.log`, `console.warn` or `console.error` depend on log
level.

    scribbly.use(consoleStreamer)
    
    
#### enableWhen(isOn)

Passes logs only when `isOn` is `true`. Useful when we want to disable/enable logs to
a certain condition. Should be applied as first.

    scribbly.use(enableWhen(process.env.DEBUG))
    
#### externalLogger(logger)

Logs to a given logger. It is expected that external logger should provide methods:
*debug, info, warning, error, critical*. If it doesn't it should be wrapped around
that kind of interface before.

    scribbly.use(externalLogger(rollbarBrowserLogger))
    
    
#### fileStreamer(fs, filePath)

Only for node. Logs to a given file. If file does not exist it creates it.

```javascript
import fs from 'fs'

scribbly.use(fileStreamer(fs, './logs.txt'))
```
    
#### levelFilter(minLevel)

Passes only logs which are equal or higher than given level.

```javascript
import scribbly, { levels } from 'scribbly'

scribbly.use(levelFilter(levels.ERROR))
```

#### namespace(name, format = '[{name}] ')

Passes logs only if given namespace is found within `DEBUG` global. `DEBUG` global
should be a string which represents list of namespaces seperated by comma. Wildcards
are respected. The middleware also adds namespace name to the log message as a prefix.

It works in a isomorphic nature and it uses different `DEBUG` global on different 
environments (browser/node):

    export DEBUG=n1,n2:sub:* // in the terminal when node (access through process.env.DEBUG)
    window.DEBUG=n1,n2:sub:* // in the browser when client

```javascript
const log = scribbly.use(namespace('n1')).use(consoleStreamer)
log.info('test')
```
    
Output:

    [n1] test
    
To pass logs from all namespaces:

    DEBUG=*
    

#### timeFormatter

It adds time information to the message.

    scribbly.use(timeFormatter)
    
## Recipes

#### Production and development logging

Common situation is when we want to log errors on production to error reporting service like
*Rollbar* but for development environment use console instead to make errors visible 
for the developer.

*logger.js*
```javascript
import scribbly from 'scribbly'
import rollbar from 'rollbar-browser'
import { consoleStreamer } from 'scribbly/middleware'

let logger

if (process.env.NODE_ENV === 'production') {
  let rollbarLogger = rollbar.init(someConfig)
  logger = scribbly.use(externalLogger(rollbarLogger))
} else {
  logger = scribbly.use(consoleStreamer)
}

export default logger
```

```javascript
import log from './logger'

log.error('Some error')
```

As you can see we can easily apply different middlewares on different conditions.

## Api

### Logger

```javascript
import { Logger } from 'scribbly'
```

Main class of the scribbly logger. Instance of it can by imported by 
`import scribbly from 'scribbly'`. It's the same as `const scribbly = new Logger()`.

**constructor(middlewares = [])**

Creates logger and set an Array of middlewares.

**middlewares**

Property. Array of middlewares. Can't be modified, it's frozen.

**use(middleware)**

Returns a new logger with combined old middlewares and the new one. 

    return new Logger(this.middlewares.concat(middleware))
    
**log(level, message, extras)**

Emit the message with extras through middlewares, in order.

- `level` - {Number} level of the log
- `message` - Any type, main content of the log
- `extras` - Any type, optional data

**debug(message, extras)**

Same as `log(levels.DEBUG, message, extras)`.

**info(message, extras)**

Same as `log(levels.INFO, message, extras)`.

**warning(message, extras)**

Same as `log(levels.WARNING, message, extras)`.

**error(message, extras)**

Same as `log(levels.ERROR, message, extras)`.

**critical(message, extras)**

Same as `log(levels.CRITICAL, message, extras)`.

### levels

```javascript
import { levels } from 'scribly'
```

Stores a set of constants which stores numerical representation of logging levels.

```javascript
export const levels = {
  DEBUG: 10,
  INFO: 20,
  WARNING: 30,
  ERROR: 40,
  CRITICAL: 50
}
```

