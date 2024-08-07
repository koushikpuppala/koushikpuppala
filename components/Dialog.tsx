'use client'

import { Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { DialogComponentProps } from '@import/types'
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react'

const DialogComponent = ({ children, tag }: DialogComponentProps) => {
	const router = useRouter()

	const handleClose = () =>
		router.replace(`?${new URLSearchParams(tag !== 'all' ? { tag: tag } : {}).toString()}`, {
			scroll: false,
		})

	return (
		<Transition show={true} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={handleClose}>
				<TransitionChild
					as={Fragment}
					enter='ease-in-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in-out duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-primary bg-opacity-75 backdrop-blur transition-opacity' />
				</TransitionChild>
				<div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<DialogPanel className='relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:m-8'>
								{children}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default DialogComponent
