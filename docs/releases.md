# Releases

## Release/Publishing

Before running the commands in 'Publishing to NPM', create a new release branch
of the form `releases/x.x.x`

After running commands in 'Publishing to NPM', the release branch should be
pushed. Now, you need to get it reviewed and merged.

After merging, pushing the tag (via `npm publish`) will trigger CI which creates
a **draft** GitHub release with prebuilt binaries attached. To finalize:

- Go to https://github.com/desktop/registry-js/releases
- Find the draft release created by CI
- Review that all assets are present (3 `.tar.gz` files)
- Hit `Publish release`

> **Note:** Publishing the release makes it immutable — assets and the tag can no
> longer be modified. If something is wrong, delete the draft and cut a new
> version.

## Publishing to NPM

Releases are done to NPM, and are currently limited to the core team.

```sh
# to ensure everything is up-to-date and tests pass
npm ci
npm test

# you might need to do a different sort of version bump here
npm version minor

# this will also run the test suite and fail if any errors found
# this will also run `git push --follow-tags` at the end
npm publish
```
