import type { ResumeFileCardProps } from 'types/components/admin'
import Link from 'next/link'
import { UploadButton } from 'components/cms/upload-button'
import { Badge } from 'components/ui/badge'
import { Download, File } from 'components/icons'

export const ResumeFileCard = ({
	fileUrl,
	downloads,
	uploading,
	onUpload,
}: ResumeFileCardProps) => (
	<div className='border-border bg-surface-strong/40 space-y-4 rounded-2xl border p-5'>
		<div className='flex items-center justify-between'>
			<span className='text-foreground font-mono text-xs font-semibold uppercase'>
				Active S3 PDF Binary
			</span>
			<Badge variant='success'>{downloads} Total Downloads</Badge>
		</div>

		<div className='border-border bg-background flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center'>
			<div className='flex min-w-0 items-center gap-3.5'>
				<div className='bg-destructive/15 text-destructive grid size-11 shrink-0 place-items-center rounded-xl'>
					<File className='size-6' />
				</div>
				<div className='min-w-0'>
					<p className='text-foreground truncate font-mono text-xs font-semibold'>
						{fileUrl.split('/').pop() || 'No file uploaded'}
					</p>
					<p className='text-muted-foreground truncate font-mono text-[0.6875rem]'>
						{fileUrl || 'No file URL'}
					</p>
				</div>
			</div>

			<div className='flex shrink-0 items-center gap-2'>
				{fileUrl ? (
					<Link
						href={fileUrl}
						target='_blank'
						rel='noopener noreferrer'
						className='border-border bg-surface text-foreground hover:bg-accent inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors'>
						<Download className='size-3.5' />
						<span>Download</span>
					</Link>
				) : null}

				<UploadButton
					accept='application/pdf'
					uploading={uploading}
					onChange={onUpload}
					label='Upload New PDF'
					size='sm'
				/>
			</div>
		</div>
	</div>
)
