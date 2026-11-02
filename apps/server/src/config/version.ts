import { join } from 'node:path'
import { readFileSync } from 'node:fs'

// Deploys write the release version into package.json inside the image only, so it is read from
// there at runtime.
const readVersion = (): string => {
	const { version } = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'))

	if (typeof version !== 'string' || !version) throw new Error('Missing version in package.json')

	return version
}

export const APP_VERSION = readVersion()
