'use client'

import type { ConfirmDialogProps } from 'types/components/admin'
import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'components/icons'
import { FormError, errorMessage } from 'components/ui/form-error'
import { Button } from 'ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from 'components/ui/dialog'

export const ConfirmDialog = ({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = 'Confirm Action',
	cancelLabel = 'Cancel',
	variant = 'destructive',
	loading = false,
	onConfirm,
}: ConfirmDialogProps) => {
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (open) setError(null)
	}, [open])

	const handleConfirm = async () => {
		setError(null)
		try {
			await onConfirm()
			onOpenChange(false)
		} catch (err) {
			setError(errorMessage(err, 'The action failed. Please try again.'))
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onClose={() => onOpenChange(false)}
				role={variant === 'destructive' ? 'alertdialog' : 'dialog'}>
				<DialogHeader>
					<div className='flex items-center gap-3'>
						{variant === 'destructive' && (
							<div className='bg-destructive/15 text-destructive grid size-10 shrink-0 place-items-center rounded-xl'>
								<AlertTriangle className='size-5' />
							</div>
						)}
						<div>
							<DialogTitle>{title}</DialogTitle>
							<DialogDescription className='mt-1'>{description}</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<FormError message={error} />
				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={loading}>
						{cancelLabel}
					</Button>
					<Button type='button' variant={variant} onClick={handleConfirm} disabled={loading}>
						{loading ? (
							<>
								<RefreshCw className='size-4 animate-spin' />
								<span>Processing…</span>
							</>
						) : (
							confirmLabel
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
