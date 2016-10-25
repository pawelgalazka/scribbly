import scribbly1 from '../index'
const scribbly2 = require('../index')

describe('scribbly main api', () => {
  it('should be accessible by commonjs import', () => {
    expect(scribbly1.use).toBeInstanceOf(Function)
  })

  it('should be accessible by es6 import', () => {
    expect(scribbly2.use).toBeInstanceOf(Function)
  })
})
