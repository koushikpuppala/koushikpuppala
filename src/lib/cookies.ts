'use server'

import { logger } from './logger'
import { cookies } from 'next/headers'

export const setCookie = async (name: string, value: string, maxAge?: number) => {
	const { set } = await cookies()

	set(name, value, {
		secure: logger._production,
		sameSite: 'strict',
		httpOnly: true,
		path: '/',
		maxAge,
	})
}

export const removeCookie = async (name: string) => {
	const { delete: del } = await cookies()

	del({
		name,
		secure: logger._production,
		sameSite: 'strict',
		httpOnly: true,
		path: '/',
		maxAge: 0,
	})
}

export const getCookie = async (name: string) => {
	const { get } = await cookies()

	return get(name)?.value
}
