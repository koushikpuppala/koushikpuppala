import { describe, expect, it } from 'vitest'
import { resumeFileName } from './resume-file-name'

describe('resumeFileName', () => {
	it('joins title and version into a lowercase, underscored name', () => {
		expect(resumeFileName('Koushik Puppala Resume', '2026.1')).toBe(
			'koushik_puppala_resume_2026.1.pdf',
		)
	})

	it('collapses symbols and trims leading and trailing underscores', () => {
		expect(resumeFileName('  — Koushik / Puppala (CV) — ', 'v2')).toBe('koushik_puppala_cv_v2.pdf')
	})

	it('leaves the title alone when the version is empty', () => {
		expect(resumeFileName('Koushik Puppala Resume', '')).toBe('koushik_puppala_resume.pdf')
		expect(resumeFileName('Koushik Puppala Resume', null)).toBe('koushik_puppala_resume.pdf')
	})

	it('falls back to resume.pdf when nothing usable is left', () => {
		expect(resumeFileName('', '')).toBe('resume.pdf')
		expect(resumeFileName('!!!', undefined)).toBe('resume.pdf')
	})

	it('keeps an already lowercase name unchanged', () => {
		expect(resumeFileName('cv', '1.0')).toBe('cv_1.0.pdf')
	})
})
