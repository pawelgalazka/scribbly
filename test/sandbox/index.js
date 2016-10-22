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

log1.info('log1')
log2.info('log2')
log3.info('ignored log')
log4.info('log4')
