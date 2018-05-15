import { expect } from 'chai'
import { enumerateValues, enumerateKeys, HKEY } from '../lib/index'

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
  describe('enumerateKeys', () => {
    it('can enumerate key names from the registry (No subkey)', () => {
      const values = enumerateKeys(HKEY.HKEY_LOCAL_MACHINE, null)

      expect(values.indexOf('HARDWARE')).gte(0)
      expect(values.indexOf('SOFTWARE')).gte(0)
      expect(values.indexOf('SYSTEM')).gte(0)
    })
    it('can enumerate key names from the registry', () => {
      const values = enumerateKeys(HKEY.HKEY_LOCAL_MACHINE, 'SOFTWARE')

      expect(values.indexOf('Classes')).gte(0)
      expect(values.indexOf('Microsoft')).gte(0)
    })
  })
}
