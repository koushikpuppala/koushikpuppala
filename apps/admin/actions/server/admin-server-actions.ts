'use server'

import { adminFetch } from '@/lib/api-client'
import type { AdminUser } from '@/components/views/users-client-view'
import type { ContactModel, ProjectModel } from 'types/models'

export const createUserAction = async (payload: {
	fullName: string
	email: string
	password: string
	role: 'ADMIN' | 'EDITOR' | 'USER'
	status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}) => {
	const res = await adminFetch<AdminUser>('/api/v1/users', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
	return res
}

export const updateUserAction = async (
	userId: string,
	payload: {
		role: 'ADMIN' | 'EDITOR' | 'USER'
		status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
	},
) => {
	const res = await adminFetch<AdminUser>(`/api/v1/users/${userId}`, {
		method: 'PATCH',
		body: JSON.stringify(payload),
	})
	return res
}

export const deleteUserAction = async (userId: string) => {
	const res = await adminFetch(`/api/v1/users/${userId}`, {
		method: 'DELETE',
	})
	return res
}

export const updateContactStatusAction = async (
	contactId: string,
	status: ContactModel['status'],
) => {
	const res = await adminFetch<ContactModel>(`/api/v1/contact/${contactId}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
	})
	return res
}

export const deleteContactAction = async (contactId: string) => {
	const res = await adminFetch(`/api/v1/contact/${contactId}`, {
		method: 'DELETE',
	})
	return res
}

export const saveProjectAction = async (id: string | undefined, payload: Partial<ProjectModel>) => {
	if (id) {
		return await adminFetch<ProjectModel>(`/api/v1/projects/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(payload),
		})
	}
	return await adminFetch<ProjectModel>('/api/v1/projects', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
}

export const deleteProjectAction = async (id: string) => {
	return await adminFetch(`/api/v1/projects/${id}`, {
		method: 'DELETE',
	})
}
