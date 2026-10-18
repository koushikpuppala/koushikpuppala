'use client'

import type { MetadataRecord } from 'types/models'
import type { MetadataForm, MetadataFormState } from 'types/components/admin'
import { useCallback, useEffect, useState, type SubmitEvent } from 'react'
import { toItems } from 'actions/collection'
import { SITE_URL } from 'constants/site-url'
import { metadataActions } from 'actions/metadata'
import { useLatestRequest } from 'lib/use-server-list'
import { FORM_KEYS } from './settings-presets'

const SAVED_MS = 3500

const blankFor = (key: string): MetadataForm => ({
	id: null,
	key,
	title: '',
	description: '',
	canonicalUrl: `${SITE_URL}${key === '/' ? '' : key}`,
	ogImage: '',
	robots: 'index,follow',
	keywords: [],
	isPublished: true,
})

const fromRecord = (record: MetadataRecord, id: string | null): MetadataForm => ({
	id: record.id ?? id,
	key: record.key,
	title: record.title || '',
	description: record.description || '',
	canonicalUrl: record.canonicalUrl || '',
	ogImage: record.ogImage || '',
	robots: record.robots || 'index,follow',
	keywords: record.keywords || [],
	isPublished: record.isPublished,
})

export const useMetadataForm = (onSaved: () => void): MetadataFormState => {
	const nextSignal = useLatestRequest()
	const [form, setForm] = useState<MetadataForm>({ ...blankFor('/'), canonicalUrl: '' })
	const [routeRecords, setRouteRecords] = useState<MetadataRecord[]>([])
	const [loading, setLoading] = useState(true)
	const [loadedOnce, setLoadedOnce] = useState(false)
	const [fetchError, setFetchError] = useState<string | null>(null)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [saveError, setSaveError] = useState('')

	const setField = <K extends keyof MetadataForm>(key: K, value: MetadataForm[K]) =>
		setForm(prev => ({ ...prev, [key]: value }))

	const populate = useCallback(
		(record: MetadataRecord) => setForm(prev => fromRecord(record, prev.id)),
		[],
	)

	const selectPath = (key: string) => {
		const existing = routeRecords.find(record => record.key === key)

		if (existing) populate(existing)
		else setForm(blankFor(key))
	}

	const loadRoutes = useCallback(async () => {
		const signal = nextSignal()

		setLoading(true)
		setFetchError(null)

		const res = await metadataActions.findByKeys<MetadataRecord>(FORM_KEYS, signal)

		if (res.aborted) return

		if (res.data) {
			const list = toItems(res.data)
			setRouteRecords(list)

			const existing =
				list.find(record => record.key === '/' || record.key === 'home') ||
				list.find(record => record.key === 'global-seo') ||
				list[0]

			if (existing) populate(existing)
		} else setFetchError(res.error ?? 'Failed to load settings from server.')

		setLoading(false)
		setLoadedOnce(true)
	}, [nextSignal, populate])

	useEffect(() => {
		loadRoutes()
	}, [loadRoutes])

	const reload = () => {
		loadRoutes()
		onSaved()
	}

	const succeed = () => {
		setSaved(true)
		reload()
		setTimeout(() => setSaved(false), SAVED_MS)
	}

	const save = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSaving(true)
		setSaveError('')
		setSaved(false)

		const { id, ...rest } = form
		const fields = {
			...rest,
			canonicalUrl: rest.canonicalUrl || null,
			ogImage: rest.ogImage || null,
		}

		try {
			if (id) {
				const res = await metadataActions.update<MetadataRecord>(id, fields)

				if (res.data) succeed()
				else if (res.error) setSaveError(res.error)
			} else {
				const res = await metadataActions.create<MetadataRecord>({
					...fields,
					type: 'PAGE',
					value: { title: form.title, description: form.description },
				})

				if (res.data?.id) {
					setField('id', res.data.id)
					succeed()
				} else if (res.error) setSaveError(res.error)
			}
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : 'Failed to save settings.')
		} finally {
			setSaving(false)
		}
	}

	return {
		form,
		setField,
		routeRecords,
		populate,
		selectPath,
		loading,
		loadedOnce,
		fetchError,
		saving,
		saved,
		saveError,
		save,
		reload,
	}
}
