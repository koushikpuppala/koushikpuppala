'use client'

import { useState } from 'react'
import { Input } from '@headlessui/react'
import { FcGoogle } from 'react-icons/fc'
import { classNames } from 'utils/classNames'
import { useAuthContext } from 'contexts/AuthContext'
import { FaArrowRight } from 'react-icons/fa6'
import { TbEye, TbEyeOff } from 'react-icons/tb'

export const AuthenticationComponent = () => {
	const { login } = useAuthContext()

	const [showPassword, setShowPassword] = useState(false)

	return (
		<form className='mt-6 flex flex-col gap-4'>
			<Input
				id='email'
				name='email'
				type='email'
				placeholder='Enter your email...'
				className={classNames(
					'w-full rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-3 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5',
				)}
			/>
			<div className='relative flex items-center justify-between'>
				<Input
					id='password'
					name='password'
					type={showPassword ? 'text' : 'password'}
					placeholder='Enter your password...'
					className={classNames(
						'w-full rounded-md border border-neutral-100/10 bg-neutral-100/0 px-3 py-3 text-sm font-medium shadow-md transition-all outline-none hover:bg-neutral-100/5',
					)}
				/>
				<div
					className='absolute right-2 cursor-pointer rounded-full p-1.5 text-neutral-300 transition-transform hover:bg-neutral-800/90'
					onClick={() => setShowPassword(!showPassword)}>
					{showPassword ? <TbEyeOff size={20} /> : <TbEye size={20} />}
				</div>
			</div>
			<button
				type='submit'
				disabled={true}
				aria-label='Sign In'
				className='group/btn relative inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium hover:bg-neutral-800/95 disabled:cursor-not-allowed disabled:opacity-50'>
				Sign In <FaArrowRight className='size-4' />
				<span className='absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100 group-disabled/btn:opacity-0' />
				<span className='absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100 group-disabled/btn:opacity-0' />
			</button>
			<div className='my-2 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent' />
			<button
				type='button'
				onClick={login}
				aria-label='Login with Google'
				className='group/btn relative inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium hover:bg-neutral-800/90'>
				<FcGoogle className='size-5' />
				<span className='text-sm text-neutral-300'>Sign in with Google</span>
				<span className='absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100' />
				<span className='absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100' />
			</button>
		</form>
	)
}
