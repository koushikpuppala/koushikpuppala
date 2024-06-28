export async function GET() {
	return new Response('Server is up and running!', {
		headers: { 'Content-Type': 'text/plain' },
		status: 200,
	})
}
