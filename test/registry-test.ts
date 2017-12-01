import { expect } from 'chai'
import { enumerateValuesSafe, HKEY } from '../lib/index'

describe('enumerateValuesSafe', () => {
  it('can read strings from the registry', () => {
    const values = enumerateValuesSafe(
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
    const values = enumerateValuesSafe(
      HKEY.HKEY_LOCAL_MACHINE,
      'SOFTWARE\\Microsoft\\ClipboardServer'
    )

    const enableZip = values.find(v => v.name == 'MaxSizeAllowedInKBytes')
    expect(enableZip!.type).equals('REG_DWORD')
    expect(enableZip!.data).equals(5120)
  })
})
