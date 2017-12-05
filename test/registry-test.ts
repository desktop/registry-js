import { expect } from 'chai'
import { enumerateValues, HKEY } from '../lib/index'

if (process.platform === 'win32') {
  describe('enumerateValue', () => {
    it('can read strings from the registry', () => {
      const values = enumerateValues(
        HKEY.HKEY_LOCAL_MACHINE,
        'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
      )

      const programFilesDir = values.find(v => v.name == 'ProgramFilesDir')
      expect(programFilesDir!.type).equals('REG_SZ')
      expect(programFilesDir!.data).contains(':\\Program Files')

      const programFilesPath = values.find(v => v.name == 'ProgramFilesPath')
      expect(programFilesPath!.type).equals('REG_EXPAND_SZ')
      expect(programFilesPath!.data).equals('%ProgramFiles%')
    })

    it('can read numbers from the registry', () => {
      const values = enumerateValues(
        HKEY.HKEY_LOCAL_MACHINE,
        'SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting'
      )

      const serviceTimeout = values.find(v => v.name == 'ServiceTimeout')
      expect(serviceTimeout!.type).equals('REG_DWORD')
      expect(serviceTimeout!.data).equals(60000)
    })

    it('can read values from HKCU', () => {
      const values = enumerateValues(
        HKEY.HKEY_CURRENT_USER,
        'SOFTWARE\\Microsoft\\Windows\\DWM'
      )

      const composition = values.find(v => v.name == 'Composition')
      expect(composition!.type).equals('REG_DWORD')
      expect(composition!.data).equals(1)
    })

    it('returns empty array when key is missing', () => {
      const values = enumerateValues(HKEY.HKEY_LOCAL_MACHINE, 'blahblahblah')

      expect(values).is.empty
    })
  })
}
