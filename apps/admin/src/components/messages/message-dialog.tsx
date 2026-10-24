'use client'

import type { ContactMessage } from 'types/api'
import type { ContactPriority, ContactStatus } from 'types/enums'
import type { MessageDialogProps } from 'types/components/admin'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from 'ui/button'
import { Select } from 'ui/select'
import { Textarea } from 'ui/textarea'
import { Mail, Trash2 } from 'components/icons'
import { Field } from 'components/form/field'
import { contactsActions } from 'actions/contacts'
import { FormError, errorMessage } from 'components/ui/form-error'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from 'components/ui/dialog'
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from 'components/messages/message-options'

const FAILED = 'Saving the triage status failed.'

const received = (message: ContactMessage | null) =>
	message?.createdAt
		? new Date(message.createdAt).toLocaleString(undefined, {
				dateStyle: 'medium',
				timeStyle: 'short',
			})
		: ''

export const MessageDialog = ({ message, onClose, onSaved, onDelete }: MessageDialogProps) => {
	const [notes, setNotes] = useState('')
	const [status, setStatus] = useState<ContactStatus>('READ')
	const [priority, setPriority] = useState<ContactPriority>('NORMAL')
	const [saving, setSaving] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)

	useEffect(() => {
		if (!message) return

		setNotes(message.internalNotes || '')
		setStatus(message.status === 'UNREAD' ? 'READ' : message.status)
		setPriority(message.priority)
		setSaveError(null)
	}, [message])

	const save = async () => {
		if (!message) return

		setSaving(true)
		setSaveError(null)

		try {
			const res = await contactsActions.update<ContactMessage>(message.id, {
				internalNotes: notes,
				status,
				priority,
			})

			if (!res.data) throw new Error(res.error || FAILED)

			onSaved()
			onClose()
		} catch (error) {
			setSaveError(errorMessage(error, FAILED))
		} finally {
			setSaving(false)
		}
	}

	return (
		<Dialog open={Boolean(message)} onOpenChange={open => !open && onClose()}>
			<DialogContent className='flex max-w-2xl flex-col p-6' onClose={onClose}>
				<DialogHeader>
					<DialogTitle>{message?.subject || 'Contact Submission'}</DialogTitle>
					<DialogDescription>
						{`From ${message?.name} (${message?.email}) • ${received(message)}`}
					</DialogDescription>
				</DialogHeader>

				{message && (
					<div className='space-y-4 pt-2'>
						<div className='border-border bg-background space-y-2 rounded-xl border p-4'>
							<p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
								Message Content
							</p>
							<p className='text-foreground text-sm leading-relaxed whitespace-pre-wrap'>
								{message.message}
							</p>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<Field id='message-status' label='Status'>
								<Select
									id='message-status'
									value={status}
									onChange={setStatus}
									options={STATUS_OPTIONS}
								/>
							</Field>
							<Field id='message-priority' label='Priority'>
								<Select
									id='message-priority'
									value={priority}
									onChange={setPriority}
									options={PRIORITY_OPTIONS}
								/>
							</Field>
						</div>

						<Field id='message-notes' label='Internal Triage Notes'>
							<Textarea
								id='message-notes'
								rows={3}
								placeholder='Add internal notes regarding resolution or follow-up...'
								value={notes}
								onChange={e => setNotes(e.target.value)}
							/>
						</Field>

						<FormError message={saveError} />

						<div className='flex items-center justify-between pt-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => {
									onClose()
									onDelete(message)
								}}
								className='text-destructive hover:bg-destructive/10'>
								<Trash2 className='mr-1.5 size-4' />
								Delete Inquiry
							</Button>

							<div className='flex items-center gap-2'>
								{message.email ? (
									<Button asChild type='button' variant='outline' size='sm'>
										<Link
											href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || 'Your message'}`)}`}>
											<Mail className='mr-1.5 size-4' />
											Reply
										</Link>
									</Button>
								) : null}
								<Button type='button' variant='signal' size='sm' onClick={save} disabled={saving}>
									{saving ? 'Saving...' : 'Save Triage Status'}
								</Button>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
