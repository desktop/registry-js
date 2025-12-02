const platform = process.env.npm_config_platform || process.platform

if (platform === 'win32') {
  process.exit(1)
}
