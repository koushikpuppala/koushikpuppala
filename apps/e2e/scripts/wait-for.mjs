const [url, timeoutSeconds = '180'] = process.argv.slice(2)
const deadline = Date.now() + Number(timeoutSeconds) * 1000

while (Date.now() < deadline) {
	try {
		if ((await fetch(url)).ok) process.exit(0)
	} catch {}
	await new Promise(resolve => setTimeout(resolve, 1000))
}

console.error(`Timed out waiting for ${url}`)
process.exit(1)
