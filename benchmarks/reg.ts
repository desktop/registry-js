const Benchmark = require('benchmark')
import { spawn } from 'child_process'
import { enumerateValues, HKEY } from '../dist/lib/index'
import { listSync } from "regedit-rs"

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
  .add('registry-js', function() {
    enumerateValues(
      HKEY.HKEY_LOCAL_MACHINE,
      'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
    )
  })
  .add('regedit-rs', function() {
    listSync('HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion')
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .run({ async: true })
