const Benchmark = require('benchmark')
import { spawn } from 'child_process'
import { enumerateValues, HKEY } from '../build/lib/index'

const suite = new Benchmark.Suite()

suite
  .add(
    'reg.exe',
    function(deferred: any) {
      const proc = spawn(
        'C:\\Windows\\System32\\reg.exe',
        ['QUERY', 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion'],
        {
          cwd: undefined,
        }
      )
      proc.on('close', code => {
        deferred.resolve()
      })
    },
    { defer: true }
  )
  .add('registry.js', function() {
    enumerateValues(
      HKEY.HKEY_LOCAL_MACHINE,
      'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
    )
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .run({ async: true })
