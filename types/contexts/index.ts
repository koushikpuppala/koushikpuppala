import { User } from 'firebase/auth'
import { RootLayoutProps } from '../app'

export type AuthContextProps = {
	currentUser: User | null
	token: string | null
	userAuthLoading: boolean
	login: () => Promise<User>
	logout: () => Promise<void>
}

export type SidebarContextProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	animate: boolean
}

export type SidebarProps = RootLayoutProps & Partial<SidebarContextProps>

export type SidebarProviderProps = SidebarProps
