import { expect } from 'chai'
import { enumerateValues, HKEY } from '../lib/index'

describe('enumerateValue', () => {
  it('can read strings from the registry', () => {
    const values = enumerateValues(
      HKEY.HKEY_LOCAL_MACHINE,
      'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
    )

    const programFilesDir = values.find(v => v.name == 'ProgramFilesDir')
    expect(programFilesDir!.type).equals('REG_SZ')
    expect(programFilesDir!.data).contains('C:\\Program Files')

    const programFilesPath = values.find(v => v.name == 'ProgramFilesPath')
    expect(programFilesPath!.type).equals('REG_EXPAND_SZ')
    expect(programFilesPath!.data).equals('%ProgramFiles%')
  })

  it('can read numbers from the registry', () => {
    const values = enumerateValues(
      HKEY.HKEY_LOCAL_MACHINE,
      'SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting'
    )

    console.log(`result: ${JSON.stringify(values)}`)

    const enableZip = values.find(v => v.name == 'EnableZip')
    expect(enableZip!.type).equals('REG_DWORD')
    expect(enableZip!.data).equals(1)

    const serviceTimeout = values.find(v => v.name == 'ServiceTimeout')
    expect(serviceTimeout!.type).equals('REG_DWORD')
    expect(serviceTimeout!.data).equals(60000)
  })
})
