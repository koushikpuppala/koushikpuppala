'use client'

import type { DialogContentProps, DialogIdsValue, DialogProps } from 'types/components/admin'
import { createContext, useContext, useEffect, useId, useRef, type HTMLAttributes } from 'react'
import { X } from 'components/icons'
import { classNames } from 'utils/classNames'

const DialogIds = createContext<DialogIdsValue | null>(null)

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
	const baseId = useId()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!open) return

		const prev = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null

		const focusables = () =>
			[...(containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter(
				el => el.offsetParent !== null,
			)

		const first =
			containerRef.current?.querySelector<HTMLElement>(
				'input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled])',
			) ?? focusables()[0]
		first?.focus()

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.defaultPrevented) return

			if (e.key === 'Escape') {
				onOpenChange(false)
				return
			}

			if (e.key === 'Tab') {
				const items = focusables()
				const firstItem = items[0]
				const lastItem = items.at(-1)
				if (!firstItem || !lastItem) return

				if (e.shiftKey && document.activeElement === firstItem) {
					e.preventDefault()
					lastItem.focus()
				} else if (!e.shiftKey && document.activeElement === lastItem) {
					e.preventDefault()
					firstItem.focus()
				}
			}
		}
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			document.body.style.overflow = prev
			window.removeEventListener('keydown', handleKeyDown)
			opener?.focus()
		}
	}, [open, onOpenChange])

	if (!open) return null

	return (
		<DialogIds.Provider
			value={{ titleId: `${baseId}-title`, descriptionId: `${baseId}-description` }}>
			<div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
				<div
					className='bg-background/80 animate-in fade-in fixed inset-0 backdrop-blur-sm transition-opacity duration-150'
					onClick={() => onOpenChange(false)}
					aria-hidden='true'
				/>
				<div
					ref={containerRef}
					className='animate-in fade-in-50 zoom-in-95 relative z-50 flex w-full justify-center duration-150'>
					{children}
				</div>
			</div>
		</DialogIds.Provider>
	)
}

export const DialogContent = ({
	className,
	children,
	onClose,
	role = 'dialog',
	'aria-label': ariaLabel,
}: DialogContentProps) => {
	const ids = useContext(DialogIds)

	const shared = {
		'aria-modal': true,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabel ? undefined : ids?.titleId,
		'aria-describedby': ids?.descriptionId,
		className: classNames(
			'border-border bg-surface relative w-full max-w-lg overflow-hidden rounded-2xl border p-6 shadow-2xl transition-all',
			className,
		),
	}

	const body = (
		<>
			{onClose && (
				<button
					type='button'
					onClick={onClose}
					className='text-muted-foreground hover:bg-accent hover:text-foreground absolute top-4 right-4 rounded-lg p-1 transition-colors'
					aria-label='Close'>
					<X className='size-4' />
				</button>
			)}
			{children}
		</>
	)

	return role === 'alertdialog' ? (
		<div role='alertdialog' {...shared}>
			{body}
		</div>
	) : (
		<div role='dialog' {...shared}>
			{body}
		</div>
	)
}

export const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={classNames('mb-4 flex flex-col space-y-1.5 text-center sm:text-left', className)}
			{...props}
		/>
	)
}

export const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={classNames(
				'border-border mt-6 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end sm:space-x-2',
				className,
			)}
			{...props}
		/>
	)
}

export const DialogTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
	const ids = useContext(DialogIds)

	return (
		<h3
			id={ids?.titleId}
			className={classNames(
				'text-foreground text-lg leading-none font-semibold tracking-tight',
				className,
			)}
			{...props}
		/>
	)
}

export const DialogDescription = ({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) => {
	const ids = useContext(DialogIds)

	return (
		<p
			id={ids?.descriptionId}
			className={classNames('text-muted-foreground text-sm leading-relaxed', className)}
			{...props}
		/>
	)
}
