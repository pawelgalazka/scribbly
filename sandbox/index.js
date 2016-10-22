const scribbly = require('scribbly').default
const m = require('scribbly/middlewares')

const log1 = scribbly.use(m.consoleStreamer)
const log2 = scribbly.use(m.namespace('main')).use(m.consoleStreamer)

log1.info('log1 test')
log2.info('log2 test')
