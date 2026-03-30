export const perf = {
	start: (label: string) => performance.mark(`${label}-start`),
	end: (label: string) => {
		performance.mark(`${label}-end`)
		performance.measure(label, `${label}-start`, `${label}-end`)
		const entry = performance.getEntriesByName(label).pop()
		if (entry) {
			console.log(`⏱ ${label}: ${entry.duration.toFixed(0)}ms`)
		}
	},
}
