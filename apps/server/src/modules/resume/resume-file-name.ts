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
