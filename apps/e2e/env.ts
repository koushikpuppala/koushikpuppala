const env = (key: string, fallback: string) => process.env[key] ?? fallback

export const API_URL = env('E2E_API_URL', 'http://127.0.0.1:5000')
export const CLIENT_URL = env('E2E_CLIENT_URL', 'http://127.0.0.1:3000')
export const ADMIN_URL = env('E2E_ADMIN_URL', 'http://127.0.0.1:3001')

export const DATABASE_URL = env(
	'E2E_DATABASE_URL',
	'postgresql://test:test@127.0.0.1:55432/portfolio_test',
)
export const REDIS_PORT = env('E2E_REDIS_PORT', '56379')
export const AUTH_EMULATOR_HOST = env('E2E_AUTH_EMULATOR_HOST', '127.0.0.1:9099')
export const FIREBASE_PROJECT_ID = 'demo-koushikpuppala'
export const REVALIDATE_SECRET = 'e2e-revalidate-secret'

export const USERS = {
	admin: { email: 'admin@e2e.test', password: 'password123', role: 'ADMIN' },
	editor: { email: 'editor@e2e.test', password: 'password123', role: 'EDITOR' },
	user: { email: 'user@e2e.test', password: 'password123', role: 'USER' },
} as const

export const CONTENT = {
	homeTitle: 'E2E Portfolio Home',
	publishedProject: { slug: 'payments-platform', title: 'Payments Platform' },
	draftProject: { slug: 'secret-project', title: 'Secret Project' },
	thumbnailMediaName: 'in-use-cover.png',
	resume: { title: 'E2E Resume', mediaName: 'e2e-resume.pdf' },
	about: { location: 'Hyderabad, India', skill: 'PostgreSQL' },
	experience: { title: 'Software Engineer', organization: 'E2E Corp' },
	education: { degree: 'B.Tech', fieldOfStudy: 'Computer Science', university: 'E2E University' },
} as const
