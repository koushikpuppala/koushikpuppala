import type { FormErrorProps } from 'types/components/admin'
import { AlertCircle } from 'components/icons'

export const FormError = ({ message }: FormErrorProps) => {
	if (!message) return null

	return (
		<div
			role='alert'
			className='border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-xs'>
			<AlertCircle className='mt-px size-3.5 shrink-0' />
			<span>{message}</span>
		</div>
	)
}

export const errorMessage = (err: unknown, fallback = 'Saving failed. Please try again.') =>
	err instanceof Error && err.message ? err.message : fallback
