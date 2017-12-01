import { expect } from 'chai'
import { enumerateValues, HKEY } from '../lib/index'

describe('enumerateValue', () => {
  it('can read entries from the registry', () => {
    const values = enumerateValues(
      HKEY.HKEY_LOCAL_MACHINE,
      'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
    )
    expect(values.length).is.greaterThan(0)

    const programFilesDir = values.find(v => v.name == 'ProgramFilesDir')
    expect(programFilesDir).is.not.null
    expect(programFilesDir!.type).equals('REG_SZ')
    expect(programFilesDir!.data).contains('C:\\Program Files')

    const programFilesPath = values.find(v => v.name == 'ProgramFilesPath')
    expect(programFilesPath).is.not.null
    expect(programFilesPath!.type).equals('REG_EXPAND_SZ')
    expect(programFilesPath!.data).equals('%ProgramFiles%')
  })
})
