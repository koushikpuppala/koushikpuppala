'use client'

import { AlertTriangle, RefreshCw } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

type ConfirmDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	confirmLabel?: string
	cancelLabel?: string
	variant?: 'destructive' | 'default' | 'signal'
	loading?: boolean
	onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = 'Confirm Action',
	cancelLabel = 'Cancel',
	variant = 'destructive',
	loading = false,
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent onClose={() => onOpenChange(false)}>
				<DialogHeader>
					<div className='flex items-center gap-3'>
						{variant === 'destructive' && (
							<div className='size-10 rounded-xl bg-destructive/15 grid place-items-center text-destructive shrink-0'>
								<AlertTriangle className='size-5' />
							</div>
						)}
						<div>
							<DialogTitle>{title}</DialogTitle>
							<DialogDescription className='mt-1'>{description}</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={loading}>
						{cancelLabel}
					</Button>
					<Button
						type='button'
						variant={variant}
						onClick={async () => {
							await onConfirm()
							onOpenChange(false)
						}}
						disabled={loading}>
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
