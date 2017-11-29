import { expect } from 'chai'
import { enumerateValues, HKEY } from '../lib/index'

describe('enumerate registry', () => {
  it('can read a string from native code', () => {
    const values = enumerateValues(
      HKEY.HKEY_LOCAL_MACHINE,
      'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
    )
    expect(values.length).is.greaterThan(0)
  })
})
