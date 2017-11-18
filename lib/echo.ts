const nativeModule = require('../build/Release/registryNativeModule.node')

export function helloWorld(): string {
  return nativeModule.helloWorld()
}
