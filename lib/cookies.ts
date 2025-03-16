'use server'

import { DOMAIN, EXPIRES_IN } from '@import/constants'
import { cookies } from 'next/headers'
import { logger } from '@import/lib'

export const setCookie = async (name: string, value: string) => {
	const { set } = await cookies()
	set(name, value, {
		domain: logger._production ? DOMAIN : undefined,
		secure: logger._production,
		sameSite: 'strict',
		httpOnly: true,
		path: '/',
		maxAge: EXPIRES_IN,
	})
}

export const removeCookie = async (name: string) => {
	const { delete: del } = await cookies()

	del({
		name,
		domain: logger._production ? DOMAIN : undefined,
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
