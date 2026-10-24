'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { DOWNLOAD_UNAVAILABLE_HASH } from 'constants/resume'

const subscribe = (onChange: () => void) => {
	window.addEventListener('hashchange', onChange)

	return () => window.removeEventListener('hashchange', onChange)
}

const isUnavailable = () => window.location.hash === `#${DOWNLOAD_UNAVAILABLE_HASH}`

// /resume/download sends visitors back here with this hash when the file can't be served. The page
// itself stays cached and static, so the notice reads the hash in the browser instead.
export const DownloadUnavailableNotice = () => {
	const unavailable = useSyncExternalStore(subscribe, isUnavailable, () => false)

	if (!unavailable) return null

	return (
		<div className='border-border bg-surface/50 border-b'>
			<p
				role='status'
				className='container-page text-muted-foreground py-4 font-mono text-[0.75rem]'>
				The resume file isn&apos;t available right now.{' '}
				<Link href='/contact' className='text-foreground underline underline-offset-4'>
					Request a copy
				</Link>{' '}
				and I&apos;ll send it to you.
			</p>
		</div>
	)
}
