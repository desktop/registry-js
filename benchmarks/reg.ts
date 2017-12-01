const Benchmark = require('benchmark')
import { spawn } from 'child_process'
import { enumerateValues, HKEY } from '../lib/index'

const suite = new Benchmark.Suite()

const key = ''

suite
  .add(
    'reg.exe',
    function(deferred: any) {
      const proc = spawn('C:\\Windows\\System32\\reg.exe', ['QUERY', key], {
        cwd: undefined,
      })
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

// logs:
// => RegExp#test x 4,161,532 +-0.99% (59 cycles)
// => String#indexOf x 6,139,623 +-1.00% (131 cycles)
// => Fastest is String#indexOf
