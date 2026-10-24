'use client'

import type {
	SingletonEditorOptions,
	SingletonEditorState,
	SingletonRecord,
} from 'types/components/admin'
import { useEffect, useRef, useState } from 'react'

const NOTICE_MS = 4000

const failure = (error: unknown, fallback: string): string =>
	error instanceof Error ? error.message : fallback

// State for pages that edit a single record, such as Home and About: load, track unsaved
// changes, save, and publish or unpublish.
export const useSingletonEditor = <T extends SingletonRecord, R extends SingletonRecord>({
	actions,
	empty,
	fromRecord,
	toPayload,
	merge = (content, saved) => ({ ...content, ...saved }),
	validate,
	label,
	loadError,
	saveError,
}: SingletonEditorOptions<T, R>): SingletonEditorState<T> => {
	const [content, setContent] = useState<T>(empty)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [publishing, setPublishing] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isDirty, setIsDirty] = useState(false)
	const [notice, setNotice] = useState<string | null>(null)
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current)
		},
		[],
	)

	const flash = (message: string) => {
		setNotice(message)
		if (timer.current) clearTimeout(timer.current)
		timer.current = setTimeout(() => setNotice(null), NOTICE_MS)
	}

	const reload = async () => {
		setLoading(true)
		setError(null)

		try {
			const res = await actions.get()

			if (res.data) setContent(fromRecord(res.data))
			else if (res.error) setError(res.error)
		} catch (err) {
			setError(failure(err, loadError))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		reload()
	}, [])

	const update = (updater: (current: T) => T) => {
		setContent(updater)
		setIsDirty(true)
	}

	const change = <K extends keyof T>(key: K, value: T[K]) =>
		update(current => ({ ...current, [key]: value }))

	const discard = () => {
		setIsDirty(false)
		reload()
	}

	const save = async () => {
		const invalid = validate?.(content)

		if (invalid) {
			setError(invalid)
			return
		}

		setSaving(true)
		setNotice(null)
		setError(null)

		try {
			const res = await actions.save(content.id, toPayload(content))

			if (res.data) {
				const saved = res.data
				setContent(current => merge(current, saved))
				setIsDirty(false)
				flash(
					saved.isPublished
						? `${label} saved. The live site updates shortly.`
						: `${label} saved as a draft.`,
				)
			} else setError(res.error || saveError)
		} catch (err) {
			setError(failure(err, 'API request failed.'))
		} finally {
			setSaving(false)
		}
	}

	const togglePublish = async () => {
		if (!content.id) return

		setPublishing(true)
		setNotice(null)
		setError(null)

		try {
			const res = await actions.togglePublish(content.id)

			if (res.data) {
				const isPublished = Boolean(res.data.isPublished)
				setContent(current => ({ ...current, isPublished }))
				flash(
					isPublished ? `${label} published to the live site.` : `${label} moved back to draft.`,
				)
			} else setError(res.error || 'Failed to change the publish status.')
		} catch (err) {
			setError(failure(err, 'API request failed.'))
		} finally {
			setPublishing(false)
		}
	}

	return {
		content,
		change,
		update,
		loading,
		saving,
		publishing,
		error,
		setError,
		isDirty,
		notice,
		setNotice,
		reload,
		discard,
		save,
		togglePublish,
	}
}
