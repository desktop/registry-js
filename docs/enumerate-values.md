# Enumerating Values

The `enumerateValues` function is used to retrieve the values stored at a given
key in the registry.

## Usage

```ts
import { enumerateValues, HKEY, RegistryValueType } from 'registry-js'

const values = enumerateValues(
  HKEY.HKEY_LOCAL_MACHINE,
  'SOFTWARE\\Microsoft\\Windows\\CurrentVersion'
)
```

## Return Value

`values` will be an array of objects, each with `name`, `type` and `data`
members.

If a key does not exist, an empty array is returned.

If you are consuming this library from TypeScript, you should see extra type
information around what's actually in `data`.

##

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
