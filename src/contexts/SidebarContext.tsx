'use client'

import type { SidebarContextProps, SidebarProviderProps } from 'types/contexts'

import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
	const context = useContext(SidebarContext)

	if (!context) throw new Error('useSidebar must be used within a SidebarProvider')

	return context
}

export const SidebarProvider = ({ children, open, setOpen, animate }: SidebarProviderProps) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<SidebarContext.Provider
			value={{ open: open ?? isOpen, setOpen: setOpen ?? setIsOpen, animate: animate ?? true }}>
			{children}
		</SidebarContext.Provider>
	)
}
