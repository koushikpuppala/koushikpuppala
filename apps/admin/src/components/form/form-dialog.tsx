'use client'

import type { FormDialogProps } from 'types/components/admin'
import { Button } from 'ui/button'
import { classNames } from 'utils/classNames'
import { FormError } from 'components/ui/form-error'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from 'components/ui/dialog'

export const FormDialog = ({
	open,
	onOpenChange,
	title,
	description,
	error,
	saving,
	submitLabel,
	onSubmit,
	className,
	aside,
	children,
}: FormDialogProps) => {
	const close = () => onOpenChange(false)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={classNames('flex max-h-[85vh] max-w-xl flex-col p-6', className)}
				onClose={close}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className='flex-1 space-y-4 overflow-y-auto pr-1'>
					<FormError message={error} />

					{children}

					<DialogFooter>
						<Button type='button' variant='outline' onClick={close}>
							Cancel
						</Button>
						<Button type='submit' variant='signal' disabled={saving}>
							{saving ? 'Saving…' : submitLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>

			{aside}
		</Dialog>
	)
}
