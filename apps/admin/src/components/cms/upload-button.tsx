'use client'

import type { UploadButtonProps } from 'types/components/admin'
import { useRef } from 'react'
import { Button } from 'ui/button'
import { RefreshCw, Upload } from 'components/icons'

export const UploadButton = ({ accept, uploading, onChange, label, size }: UploadButtonProps) => {
	const input = useRef<HTMLInputElement>(null)
	const icon = size === 'sm' ? 'size-3.5' : 'size-4'

	return (
		<>
			{/* Hidden from the tab order on purpose: the real button below opens it, so keyboard users get a focusable control. */}
			<input
				ref={input}
				type='file'
				accept={accept}
				className='hidden'
				tabIndex={-1}
				aria-hidden='true'
				onChange={onChange}
				disabled={uploading}
			/>
			<Button
				type='button'
				variant='signal'
				size={size}
				disabled={uploading}
				onClick={() => input.current?.click()}>
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
			</Button>
		</>
	)
}
