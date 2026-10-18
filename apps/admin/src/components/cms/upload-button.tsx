import type { UploadButtonProps } from 'types/components/admin'
import { Button } from 'ui/button'
import { RefreshCw, Upload } from 'components/icons'

export const UploadButton = ({ accept, uploading, onChange, label, size }: UploadButtonProps) => {
	const icon = size === 'sm' ? 'size-3.5' : 'size-4'

	return (
		<label className='cursor-pointer'>
			<input
				type='file'
				accept={accept}
				className='hidden'
				onChange={onChange}
				disabled={uploading}
			/>
			<Button type='button' variant='signal' size={size} disabled={uploading} asChild>
				<span>
					{uploading ? (
						<>
							<RefreshCw className={`${icon} animate-spin`} />
							<span>Uploading to S3…</span>
						</>
					) : (
						<>
							<Upload className={icon} />
							<span>{label}</span>
						</>
					)}
				</span>
			</Button>
		</label>
	)
}
