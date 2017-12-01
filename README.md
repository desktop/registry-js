# lean-mean-registry-api

## A simple and opinionated library for the Windows registry

This library is a simple wrapper to interacting with the Windows registry. This
is currently in preview, so it does not support all scenarios.

## Goals

* zero dependencies
* faster than `reg.exe`
* implement common features, don't replicate the registry API
* leverage TypeScript declarations wherever possible

## Examples

### Enumerating Values

Here's a simple way to query the values found at a given registry key:

```ts
import { enumerateValues, HKEY } from 'lean-mean-registry-api'

const values = enumerateValues(
  HKEY.HKEY_LOCAL_MACHINE,
  'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
)
```

`values` will be an array of objects, each with `name`, `type` and `data`
members. If you are consuming this library from TypeScript, you should get some
extra type information around what's actually in `data`.
