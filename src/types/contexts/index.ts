import type { User } from 'firebase/auth'
import type { RootLayoutProps } from 'types/app'

import { motion } from 'motion/react'

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

export type SidebarBodyProps = React.ComponentProps<typeof motion.div> &
	Partial<SidebarContextProps>

export type SidebarButtonProps = {
	label?: string
	icon?: React.JSX.Element | React.ReactNode
} & React.ComponentProps<'button'>

export type SidebarProviderProps = RootLayoutProps & Partial<SidebarContextProps>
