'use client'

import type { FormDialogOptions, FormDialogState } from 'types/components/admin'
import { useEffect, useState, type SubmitEvent } from 'react'
import { errorMessage } from 'components/ui/form-error'

export const useFormDialog = <T, P = Partial<T>>({
	open,
	record,
	empty,
	normalize = value => value,
	toPayload,
	onSave,
	onOpenChange,
}: FormDialogOptions<T, P>): FormDialogState<T> => {
	const [form, setForm] = useState<Partial<T>>(record ? normalize(record) : empty)
	const [saving, setSaving] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)

	const initial = () => (record ? normalize(record) : empty)

	// Start from the record (or a blank form) every time the dialog opens, so values left over
	// from a cancelled edit or an earlier create never carry into the next one.
	useEffect(() => {
		if (!open) return

		setForm(initial())
		setSaveError(null)
	}, [open, record])

	const setField = <K extends keyof T>(key: K, value: T[K]) =>
		setForm(prev => ({ ...prev, [key]: value }))

	const submit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSaving(true)
		setSaveError(null)

		try {
			await onSave(toPayload(form))
			setForm(initial())
			onOpenChange(false)
		} catch (error) {
			setSaveError(errorMessage(error))
		} finally {
			setSaving(false)
		}
	}

	return { form, setForm, setField, saving, saveError, submit }
}
