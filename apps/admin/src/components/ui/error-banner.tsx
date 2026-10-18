import type { ErrorBannerProps } from 'types/components/admin'
import { Button } from 'ui/button'

export const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => (
	<div
		role='alert'
		className='border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between gap-4 rounded-xl border p-4 text-xs'>
		<span>{message}</span>
		{onRetry && (
			<Button type='button' variant='outline' size='sm' onClick={onRetry} className='text-xs'>
				Retry API Fetch
			</Button>
		)}
	</div>
)
