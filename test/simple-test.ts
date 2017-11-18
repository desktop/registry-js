import { expect } from 'chai'
import { helloWorld } from '../lib/index'

describe('a simple test', () => {
  it('can read a string from native code', () => {
    expect(helloWorld()).to.equal('Hello world!')
  })
})
