import { join } from 'node:path'
import { readFileSync } from 'node:fs'

// release-please bumps this package.json, and the image runs `node dist/main.js` directly, so
// npm_package_version is not set there; the file sits two levels above dist/config and src/config.
const readVersion = (): string => {
	const { version } = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'))

	if (typeof version !== 'string' || !version) throw new Error('Missing version in package.json')

	return version
}

export const APP_VERSION = readVersion()
