import { RESUME_MAX_BYTES as SHARED_MAX_BYTES } from 'types'
import { describe, expect, it } from 'vitest'
import { RESUME_MAX_BYTES } from './resume.constants'

describe('resume constants', () => {
	it('match the limit the admin checks before uploading', () => {
		expect(RESUME_MAX_BYTES).toBe(SHARED_MAX_BYTES)
	})
})
