import './env'

import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const setup = () => {
	execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
		cwd: resolve(__dirname, '../../../packages/prisma'),
		env: process.env,
		stdio: 'inherit',
	})
}

export default setup
