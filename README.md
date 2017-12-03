# registry-js

## A simple and opinionated library for the Windows registry

This library is a simple wrapper to interacting with the Windows registry. This
is currently in preview, with support for features that GitHub Desktop and Atom
require.

## Goals

* zero dependencies
* faster than `reg.exe`
* implement based on usage - don't replicate the registry API
* leverage TypeScript declarations wherever possible

## But Why?

The current set of libraries for interacting with the registry have some
limitations that meant we couldn't use it in GitHub Desktop:

* [`windows-registry`](https://www.npmjs.com/package/windows-registry) depends
  on `ffi` at runtime, which caused issues with webpack-ing, and was missing
  APIs we needed.
* [`node-winreg`](https://www.npmjs.com/package/node-winreg) depends on
  `reg.exe` which breaks as soon as you enable "Prevent access to registry
  editing tools" Group Policy rules (yes, even `QUERY` operations are caught by
  this)

After exploring other options like invoking PowerShell - which was too slow - we
decided to write our own little library to do the stuff we require by invoking
the Win32 APIs directly.

## Usage, Not Feature Parity

This project isn't about implementing a 1-1 replication of the Windows registry
API. If you want to see something supported, open an issue to start a discussion
about it.

## Examples

### Enumerating Values

Here's a simple way to query the values found at a given registry key:

```ts
import { enumerateValues, HKEY, RegistryValueType } from 'registry-js'

const values = enumerateValues(
  HKEY.HKEY_LOCAL_MACHINE,
  'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
)
```

`values` will be an array of objects, each with `name`, `type` and `data`
members. If you are consuming this library from TypeScript, you should get some
extra type information around what's actually in `data`.

```ts
for (const value of values) {
  if (value.type === RegistryValueType.REG_SZ) {
    const stringData = value.data
    console.log(`Found: ${value.name} is ${path}`)
  } else if (value.type === RegistryValueType.REG_DWORD) {
    // 32-bit number is converted into a JS number
    const numberData = value.data
    console.log(`Found: ${value.name} is ${path}`)
  }
  // TODO: support other formats
}
```
