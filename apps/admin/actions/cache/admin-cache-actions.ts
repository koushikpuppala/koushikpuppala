'use cache'

import { getApiBaseUrl } from '@/lib/api-client'
import type { AdminUser } from '@/lib/auth'
import type { AuditLogModel, ApiMetricModel, ContactModel, ProjectModel } from 'types/models'

export const fetchAdminUsers = async () => {
	const baseUrl = getApiBaseUrl()
	try {
		const res = await fetch(`${baseUrl}/api/v1/users`, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 60 },
		})
		if (!res.ok) return []
		const json = await res.json()
		const items = json?.result || json?.data || json?.items || (Array.isArray(json) ? json : [])
		return items as AdminUser[]
	} catch {
		return []
	}
}

export const fetchAuditLogs = async () => {
	const baseUrl = getApiBaseUrl()
	try {
		const res = await fetch(`${baseUrl}/api/v1/audit-logs`, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 30 },
		})
		if (!res.ok) return []
		const json = await res.json()
		const items = json?.result || json?.data || json?.items || (Array.isArray(json) ? json : [])
		return items as AuditLogModel[]
	} catch {
		return []
	}
}

export const fetchApiMetrics = async () => {
	const baseUrl = getApiBaseUrl()
	try {
		const res = await fetch(`${baseUrl}/api/v1/metrics`, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 30 },
		})
		if (!res.ok) return []
		const json = await res.json()
		const items = json?.result || json?.data || json?.items || (Array.isArray(json) ? json : [])
		return items as ApiMetricModel[]
	} catch {
		return []
	}
}

export const fetchContactMessages = async () => {
	const baseUrl = getApiBaseUrl()
	try {
		const res = await fetch(`${baseUrl}/api/v1/contact`, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 30 },
		})
		if (!res.ok) return []
		const json = await res.json()
		const items = json?.result || json?.data || json?.items || (Array.isArray(json) ? json : [])
		return items as ContactModel[]
	} catch {
		return []
	}
}

export const fetchProjects = async () => {
	const baseUrl = getApiBaseUrl()
	try {
		const res = await fetch(`${baseUrl}/api/v1/projects`, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 60 },
		})
		if (!res.ok) return []
		const json = await res.json()
		const items = json?.result || json?.data || json?.items || (Array.isArray(json) ? json : [])
		return items as ProjectModel[]
	} catch {
		return []
	}
}
