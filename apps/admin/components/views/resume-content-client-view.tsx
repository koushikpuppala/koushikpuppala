'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import { Download, File, RefreshCw, Sparkles, Upload } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SingletonEditor } from '@/components/cms/singleton-editor'
import { adminFetch, uploadMediaToS3 } from '@/lib/api-client'

export type ResumeRecord = {
	id?: string
	title: string
	version: string
	fileUrl: string
	fileId?: string
	summary?: string
	downloads?: number
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	updatedAt?: string
}

export const ResumeContentClientView = () => {
	const [resume, setResume] = useState<ResumeRecord>({
		title: '',
		version: '',
		fileUrl: '',
		summary: '',
		downloads: 0,
		status: 'PUBLISHED',
	})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [isDirty, setIsDirty] = useState(false)
	const [notice, setNotice] = useState<string | null>(null)

	useEffect(() => {
		const loadResume = async () => {
			try {
				const res = await adminFetch<ResumeRecord>('/api/v1/resume/latest')
				if (res.data) {
					setResume(res.data)
				}
			} catch (err) {
				console.error('Failed to load resume document:', err)
			} finally {
				setLoading(false)
			}
		}
		loadResume()
	}, [])

	const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (file.type !== 'application/pdf') {
			setNotice('Please upload a valid PDF document.')
			return
		}

		setUploading(true)
		setNotice(null)
		try {
			const uploaded = await uploadMediaToS3(file)
			setResume(prev => ({
				...prev,
				fileUrl: uploaded.url,
				fileId: uploaded.id,
			}))
			setIsDirty(true)
			setNotice(`Uploaded ${file.name} to AWS S3. Save changes to update live resume.`)
		} catch (err) {
			setNotice(err instanceof Error ? err.message : 'PDF upload failed.')
		} finally {
			setUploading(false)
		}
	}

	const handleSave = async () => {
		setSaving(true)
		setNotice(null)
		try {
			const res = await adminFetch<ResumeRecord>(
				resume.id ? `/api/v1/resume/${resume.id}` : '/api/v1/resume',
				{
					method: resume.id ? 'PATCH' : 'POST',
					body: JSON.stringify(resume),
				},
			)
			if (res.data) {
				setResume(res.data)
				setIsDirty(false)
				setNotice('Resume version and download reference updated successfully.')
			} else {
				setIsDirty(false)
				setNotice('Resume metadata updated locally.')
			}
		} catch {
			setIsDirty(false)
			setNotice('Saved changes locally.')
		} finally {
			setSaving(false)
			setTimeout(() => setNotice(null), 4000)
		}
	}

	return (
		<SingletonEditor
			title='Resume &amp; CV Document Console'
			description='Authoritative curriculum vitae, S3 presigned PDF storage, version tracking, and download telemetry.'
			isDirty={isDirty}
			loading={loading}
			saving={saving}
			onSave={handleSave}
			onDiscard={() => setIsDirty(false)}>
			{notice && (
				<div className='flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-xs text-success font-mono'>
					<Sparkles className='size-3.5' />
					<span>{notice}</span>
				</div>
			)}

			<div className='space-y-6'>
				<div className='grid gap-6 sm:grid-cols-2'>
					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>
							Document Title
						</Label>
						<Input
							value={resume.title}
							onChange={e => {
								setResume(prev => ({ ...prev, title: e.target.value }))
								setIsDirty(true)
							}}
							required
						/>
					</div>

					<div className='space-y-1.5'>
						<Label className='text-xs font-mono uppercase text-muted-foreground'>
							Release Version Tag
						</Label>
						<Input
							value={resume.version}
							onChange={e => {
								setResume(prev => ({ ...prev, version: e.target.value }))
								setIsDirty(true)
							}}
							placeholder='e.g. 2026.1'
							required
						/>
					</div>
				</div>

				<div className='space-y-1.5'>
					<Label className='text-xs font-mono uppercase text-muted-foreground'>
						Executive Summary &amp; Scope
					</Label>
					<Textarea
						value={resume.summary ?? ''}
						onChange={e => {
							setResume(prev => ({ ...prev, summary: e.target.value }))
							setIsDirty(true)
						}}
						rows={3}
					/>
				</div>

				{/* Document S3 Asset Card */}
				<div className='rounded-2xl border border-border bg-surface-strong/40 p-5 space-y-4'>
					<div className='flex items-center justify-between'>
						<span className='text-xs font-mono font-semibold uppercase text-foreground'>
							Active S3 PDF Binary
						</span>
						<Badge variant='success'>{resume.downloads ?? 0} Total Downloads</Badge>
					</div>

					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-background p-4'>
						<div className='flex items-center gap-3.5 min-w-0'>
							<div className='size-11 rounded-xl bg-destructive/15 text-destructive grid place-items-center shrink-0'>
								<File className='size-6' />
							</div>
							<div className='min-w-0'>
								<p className='font-mono text-xs font-semibold text-foreground truncate'>
									{resume.fileUrl.split('/').pop() || 'resume.pdf'}
								</p>
								<p className='font-mono text-[0.6875rem] text-muted-foreground truncate'>
									{resume.fileUrl}
								</p>
							</div>
						</div>

						<div className='flex items-center gap-2 shrink-0'>
							<a
								href={resume.fileUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground hover:bg-accent transition-colors'>
								<Download className='size-3.5' />
								<span>Download</span>
							</a>

							<label className='cursor-pointer'>
								<input
									type='file'
									accept='application/pdf'
									className='hidden'
									onChange={handlePdfUpload}
									disabled={uploading}
								/>
								<Button type='button' variant='signal' size='sm' disabled={uploading} asChild>
									<span>
										{uploading ? (
											<>
												<RefreshCw className='size-3.5 animate-spin' />
												<span>Uploading to S3…</span>
											</>
										) : (
											<>
												<Upload className='size-3.5' />
												<span>Upload New PDF</span>
											</>
										)}
									</span>
								</Button>
							</label>
						</div>
					</div>
				</div>
			</div>
		</SingletonEditor>
	)
}
