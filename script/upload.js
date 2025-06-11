// to ensure that env not in the CI server log

const path = require('path')
const { spawnSync } = require('child_process')

// Make sure output of the script is logged to the console and also the error is
// caught and logged.
if (!process.env.GITHUB_AUTH_TOKEN) {
  console.error(
    'GITHUB_AUTH_TOKEN is not set. Please set it to upload prebuilds.'
  )
  process.exit(1)
}

try {
  const result = spawnSync(
    path.join(
      __dirname,
      '../node_modules/.bin/prebuild' +
        (process.platform === 'win32' ? '.cmd' : '')
    ),
    ['--upload-all', process.env.GITHUB_AUTH_TOKEN],
    { stdio: 'inherit' }
  )

  if (result.error) {
    console.error('Error uploading prebuilds:', result.error)
    process.exit(1)
  }
  if (result.status !== 0) {
    console.error('Prebuild upload failed with status:', result.status)
    process.exit(result.status)
  }
  console.log('Prebuilds uploaded successfully.')
} catch (error) {
  console.error('An unexpected error occurred:', error)
  process.exit(1)
}
