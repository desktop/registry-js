const nativeModule = require('../../build/Release/registry.node')

/**
 * Utility function used to achieve exhaustive type checks at compile time.
 *
 * If the type system is bypassed or this method will throw an exception
 * using the second parameter as the message.
 *
 * @param {x}       Placeholder parameter in order to leverage the type
 *                  system. Pass the variable which has been type narrowed
 *                  in an exhaustive check.
 *
 * @param {message} The message to be used in the runtime exception.
 *
 */
function assertNever(x: never, message: string): never {
  throw new Error(message)
}

/**
 * Note: not all of these are currently implemented.
 *
 * Source: https://msdn.microsoft.com/en-us/library/windows/desktop/ms724884(v=vs.85).aspx
 */
export enum RegistryValueType {
  REG_BINARY = 'REG_BINARY',
  REG_DWORD = 'REG_DWORD',
  REG_DWORD_LITTLE_ENDIAN = 'REG_DWORD_LITTLE_ENDIAN',
  REG_DWORD_BIG_ENDIAN = 'REG_DWORD_BIG_ENDIAN',
  REG_EXPAND_SZ = 'REG_EXPAND_SZ',
  REG_LINK = 'REG_LINK',
  REG_MULTI_SZ = 'REG_MULTI_SZ',
  REG_NONE = 'REG_NONE',
  REG_QWORD = 'REG_QWORD',
  REG_QWORD_LITTLE_ENDIAN = 'REG_QWORD_LITTLE_ENDIAN',
  REG_SZ = 'REG_SZ',
}

export type RegistryStringEntry = {
  readonly name: string
  readonly type: RegistryValueType.REG_SZ | RegistryValueType.REG_EXPAND_SZ
  readonly data: string
}

export type RegistryNumberEntry = {
  readonly name: string
  readonly type: RegistryValueType.REG_DWORD
  readonly data: number
}

// TODO: define some other shapes of data
export type RegistryValue = RegistryStringEntry | RegistryNumberEntry

export enum HKEY {
  HKEY_CLASSES_ROOT = 'HKEY_CLASSES_ROOT',
  HKEY_CURRENT_CONFIG = 'HKEY_CURRENT_CONFIG',
  HKEY_DYN_DATA = 'HKEY_DYN_DATA',
  HKEY_CURRENT_USER_LOCAL_SETTINGS = 'HKEY_CURRENT_USER_LOCAL_SETTINGS',
  HKEY_CURRENT_USER = 'HKEY_CURRENT_USER',
  HKEY_LOCAL_MACHINE = 'HKEY_LOCAL_MACHINE',
  HKEY_PERFORMANCE_DATA = 'HKEY_PERFORMANCE_DATA',
  HKEY_PERFORMANCE_TEXT = 'HKEY_PERFORMANCE_TEXT',
  HKEY_PERFORMANCE_NLSTEXT = 'HKEY_PERFORMANCE_NLSTEXT',
  HKEY_USERS = 'HKEY_USERS',
}

function mapToLong(key: HKEY): number {
  if (key === HKEY.HKEY_CLASSES_ROOT) return 0x80000000
  if (key === HKEY.HKEY_CURRENT_USER) return 0x80000001
  if (key === HKEY.HKEY_LOCAL_MACHINE) return 0x80000002
  if (key === HKEY.HKEY_USERS) return 0x80000003
  if (key === HKEY.HKEY_PERFORMANCE_DATA) return 0x80000004
  if (key === HKEY.HKEY_CURRENT_CONFIG) return 0x80000005
  if (key === HKEY.HKEY_DYN_DATA) return 0x80000006
  if (key === HKEY.HKEY_CURRENT_USER_LOCAL_SETTINGS) return 0x80000007
  if (key === HKEY.HKEY_PERFORMANCE_TEXT) return 0x80000050
  if (key === HKEY.HKEY_PERFORMANCE_NLSTEXT) return 0x80000060

  return assertNever(key, 'The key does not map to an expected number value')
}

export function enumerateValues(
  key: HKEY,
  subkey: string
): ReadonlyArray<RegistryValue> {
  const hkey = mapToLong(key)

  const result: ReadonlyArray<RegistryValue> = nativeModule.readValues(
    hkey,
    subkey
  )

  return result
}

export function enumerateValuesSafe(
  key: HKEY,
  subkey: string
): ReadonlyArray<RegistryValue> {
  try {
    return enumerateValues(key, subkey)
  } catch {
    return []
  }
}
