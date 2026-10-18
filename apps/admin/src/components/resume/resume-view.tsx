'use client'

import type { ResumeRecord } from 'types/models'
import { useState, type ChangeEvent } from 'react'
import { Input } from 'ui/input'
import { Textarea } from 'ui/textarea'
import { resumeActions } from 'actions/resume'
import { Notice } from 'components/cms/notice'
import { Field } from 'components/form/field'
import { uploadMediaToS3 } from 'lib/api-client'
import { RESUME_MAX_BYTES } from 'types/api'
import { ResumeFileCard } from './resume-file-card'
import { SingletonFormSkeleton } from 'components/skeletons'
import { useSingletonEditor } from 'lib/use-singleton-editor'
import { SingletonEditor } from 'components/cms/singleton-editor'

const EMPTY: ResumeRecord = {
	title: '',
	versionName: '',
	summary: '',
	downloads: 0,
	isPublished: false,
}

const fromRecord = (resume: ResumeRecord): ResumeRecord => ({
	...resume,
	versionName: resume.versionName ?? '',
	isPublished: Boolean(resume.isPublished),
})

const toPayload = (resume: ResumeRecord) => ({
	title: resume.title || '',
	versionName: resume.versionName || undefined,
	summary: resume.summary || undefined,
	mediaId: resume.mediaId,
	fileSize: resume.fileSize ?? resume.media?.size,
	fileType: resume.fileType || undefined,
	isPublished: Boolean(resume.isPublished),
})

const merge = (resume: ResumeRecord, saved: ResumeRecord): ResumeRecord => ({
	...resume,
	id: saved.id,
	isPublished: Boolean(saved.isPublished),
	downloadFileName: saved.downloadFileName,
})

export const ResumeView = () => {
	const [uploading, setUploading] = useState(false)
	const editor = useSingletonEditor({
		actions: resumeActions,
		empty: EMPTY,
		fromRecord,
		toPayload,
		merge,
		validate: resume => {
			if (!resume.title?.trim()) return 'Document title is required.'
			if (!resume.versionName?.trim()) return 'Release version tag is required.'

			return resume.mediaId ? null : 'Upload a PDF before saving the resume.'
		},
		label: 'Resume',
		loadError: 'Failed to load resume from API.',
		saveError: 'Failed to save resume record.',
	})
	const { content: resume, change, update } = editor

	const uploadPdf = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (!file) return

		// The API rejects anything else on save; checking first avoids uploading a file that can't be used.
		if (file.type !== 'application/pdf') {
			editor.setError('The resume must be a PDF document.')
			return
		}

		if (file.size > RESUME_MAX_BYTES) {
			editor.setError('The resume PDF must be 10 MB or smaller.')
			return
		}

		setUploading(true)
		editor.setNotice(null)

		try {
			const uploaded = await uploadMediaToS3(file, 'resume')

			update(current => ({
				...current,
				mediaId: uploaded.id,
				media: { id: uploaded.id, fileName: file.name, url: uploaded.url },
				fileSize: file.size,
				fileType: file.type,
			}))
			editor.setNotice(`Uploaded ${file.name} to AWS S3. Save changes to update live resume.`)
		} catch (err) {
			editor.setError(err instanceof Error ? err.message : 'PDF upload failed.')
		} finally {
			setUploading(false)
		}
	}

	return (
		<SingletonEditor
			skeleton={<SingletonFormSkeleton layout='resume' />}
			title='Resume & CV Document Console'
			description='Authoritative curriculum vitae, S3 presigned PDF storage, version tracking, and download telemetry.'
			isDirty={editor.isDirty}
			loading={editor.loading}
			saving={editor.saving}
			error={editor.error}
			onRetry={editor.reload}
			onSave={editor.save}
			onDiscard={editor.discard}
			isPublished={Boolean(resume.isPublished)}
			canPublish={Boolean(resume.id)}
			publishing={editor.publishing}
			onTogglePublish={editor.togglePublish}>
			<Notice message={editor.notice} />

			<div className='space-y-6'>
				<div className='grid gap-6 sm:grid-cols-2'>
					<Field variant='editor' id='resume-document-title' label='Document Title' required>
						<Input
							id='resume-document-title'
							value={resume.title}
							onChange={e => change('title', e.target.value)}
							required
						/>
					</Field>
					<Field
						variant='editor'
						id='resume-release-version-tag'
						label='Release Version Tag'
						required>
						<Input
							id='resume-release-version-tag'
							value={resume.versionName ?? ''}
							onChange={e => change('versionName', e.target.value)}
							placeholder='e.g. 2026.1'
							required
						/>
					</Field>
				</div>

				<Field
					variant='editor'
					id='resume-executive-summary-scope'
					label='Executive Summary & Scope'>
					<Textarea
						id='resume-executive-summary-scope'
						value={resume.summary ?? ''}
						onChange={e => change('summary', e.target.value)}
						rows={3}
					/>
				</Field>

				<ResumeFileCard
					fileUrl={resume.media?.url ?? ''}
					downloadFileName={resume.downloadFileName}
					downloads={resume.downloads ?? 0}
					uploading={uploading}
					onUpload={uploadPdf}
				/>
			</div>
		</SingletonEditor>
	)
}
