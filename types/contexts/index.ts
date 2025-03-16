import { User } from 'firebase/auth'

export type AuthContextProps = {
	currentUser: User | null
	token: string | null
	userAuthLoading: boolean
	login: () => Promise<User>
	logout: () => Promise<void>
}
