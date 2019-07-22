# registry-js

## A simple and opinionated library for working with the Windows registry

## Goals

* zero dependencies
* faster than `reg.exe`
* implement based on usage - don't replicate the registry API
* leverage TypeScript declarations wherever possible

**Note:** This is currently in preview, with support for features that GitHub
Desktop and Atom require.

## Install 

```shellsession
$ npm install --save registry-js
# or
$ yarn add registry-js
```

## But Why?

The current set of libraries for interacting with the registry have some
limitations that meant we couldn't use it in GitHub Desktop:

* [`windows-registry`](https://www.npmjs.com/package/windows-registry) depends
  on `ffi` at runtime, which caused issues with webpack-ing, and was missing
  APIs we needed.
* [`node-winreg`](https://www.npmjs.com/package/node-winreg) depends on
  `reg.exe` which breaks as soon as you enable "Prevent access to registry
  editing tools" Group Policy rules (yes, even `QUERY` operations are caught by
  this). More details about this can be found in
  [desktop/desktop#3105](https://github.com/desktop/desktop/issues/3105).

After exploring other options like invoking PowerShell - which was too slow - we
decided to write our own little library to do the stuff we require by invoking
the Win32 APIs directly.

## Documentation

See the documentation under the
[`docs`](https://github.com/desktop/registry-js/tree/master/docs) folder.

## Supported versions

Each release of `registry-js` includes prebuilt binaries for the versions of
Node and Electron that are actively supported by these projects. Please refer
to the release documentation for [Node](https://github.com/nodejs/Release) and
[Electron](https://electronjs.org/docs/tutorial/support) to see what is
supported currently.

## Contributing

Read the [Setup](https://github.com/desktop/registry-js/blob/master/docs/index.md#setup)
section to ensure your development environment is setup for what you need.

This project isn't about implementing a 1-1 replication of the Windows registry
API, but implementing just enough for whatever usages there are in the wild.

If you want to see something supported, open an issue to start a discussion
about it.
