const scribbly = require('scribbly')
const m = require('scribbly/middlewares')
const fs = require('fs')

const log1 = scribbly.use(m.consoleStreamer)
const log2 = scribbly.use(m.namespace('main')).use(m.consoleStreamer)
const log3 = scribbly.use(m.namespace('ignored')).use(m.consoleStreamer)
const log4 = scribbly
  .use(m.timeFormatter)
  .use(m.consoleStreamer)
  .use(m.fileStreamer(fs, './log.txt'))

log1.info('msg1')
log2.info('msg2')
log3.info('ignored log')
log4.info('msg3', {extras: 'abc'})
log4.info('msg4')
