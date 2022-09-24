import { User } from 'firebase/auth'

export type AuthService = {
	google: () => Promise<User>
	github: () => Promise<User>
	signIn: (email: string, password: string) => Promise<User>
	signUp: (email: string, password: string) => Promise<User>
	logout: () => Promise<void>
}
