# Releases

## Release/Publishing

Before running the commands in 'Publishing to NPM', create a new release branch
of the form `releases/x.x.x`

After running commands in 'Publishing to NPM', the release branch should be
pushed. Now, you need to get it reviewed and merged.

After that, don't forget publish the release on the repo.

- Go to https://github.com/desktop/registry-js/releases
- Click click `Draft a New Release`
- Fill in form
- Hit `Publish release`

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
