const scribbly = require('scribbly').default
const m = require('scribbly/middlewares')

const log1 = scribbly.use(m.consoleStreamer)

log1.info('log1 test')
