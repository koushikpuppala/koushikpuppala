// Builds the saved file name from the current title and version, e.g. 'Koushik Puppala Resume'
// and '2026.1' give 'koushik_puppala_resume_2026.1.pdf'. Signed at download time, so a rename
// changes the name without a new upload.
export const resumeFileName = (title?: string | null, versionName?: string | null): string => {
	const base = [title, versionName]
		.map(part => part?.trim() ?? '')
		.filter(Boolean)
		.join(' ')
		.toLowerCase()
		.replace(/[^a-z0-9.]+/g, '_')
		.replace(/^_|_$/g, '')

	return `${base || 'resume'}.pdf`
}
