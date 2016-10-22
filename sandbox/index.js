const scribbly = require('scribbly').default
const m = require('scribbly/middlewares')
const fs = require('fs')

const log1 = scribbly.use(m.consoleStreamer)
const log2 = scribbly.use(m.namespace('main')).use(m.consoleStreamer)
const log3 = scribbly.use(m.namespace('ignored')).use(m.consoleStreamer)
const log4 = scribbly
  .use(m.timeFormatter)
  .use(m.consoleStreamer)
  .use(m.fileStreamer(fs, './log.txt'))

log1.info('log1 test')
log2.info('log2 test')
log3.info('log3 test (should be ignored)')
log4.info('timed')
