'use client'

import * as React from 'react'
import { X } from '@/components/icons'
import { cn } from '@/lib/utils'

type DialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
	React.useEffect(() => {
		if (open) {
			const prev = document.body.style.overflow
			document.body.style.overflow = 'hidden'
			return () => {
				document.body.style.overflow = prev
			}
		}
	}, [open])

	if (!open) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
			{/* Backdrop */}
			<div
				className='fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity'
				onClick={() => onOpenChange(false)}
				aria-hidden='true'
			/>
			{/* Focus Trap / Container */}
			<div className='relative z-50 w-full max-w-lg'>{children}</div>
		</div>
	)
}

export function DialogContent({
	className,
	children,
	onClose,
}: {
	className?: string
	children: React.ReactNode
	onClose?: () => void
}) {
	return (
		<div
			role='dialog'
			aria-modal='true'
			className={cn(
				'relative w-full overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl transition-all',
				className,
			)}>
			{onClose && (
				<button
					type='button'
					onClick={onClose}
					className='absolute top-4 right-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
					aria-label='Close'>
					<X className='size-4' />
				</button>
			)}
			{children}
		</div>
	)
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}
			{...props}
		/>
	)
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 pt-4 border-t border-border',
				className,
			)}
			{...props}
		/>
	)
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}
			{...props}
		/>
	)
}

export function DialogDescription({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return <p className={cn('text-sm text-muted-foreground leading-relaxed', className)} {...props} />
}
