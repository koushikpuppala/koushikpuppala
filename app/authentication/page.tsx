import type { Metadata } from 'next'

import { AuthContextProvider } from 'contexts/AuthContext'
import { AuthenticationComponent } from 'components/authentication'

export const metadata: Metadata = {
	title: 'Authentication',
	openGraph: { title: 'Authentication' },
	twitter: { title: 'Authentication' },
}

const AuthenticationPage = async () => {
	return (
		<AuthContextProvider>
			<main className='flex h-screen w-full flex-col gap-0.5 p-0.5 lg:flex-row lg:gap-1 lg:p-1.5'>
				<section className='mx-auto flex size-full flex-col items-center justify-center gap-4 overflow-hidden rounded-md bg-neutral-900 bg-cover bg-center bg-no-repeat px-2 py-2 sm:px-4'>
					<div className='w-full rounded-md border border-neutral-800 px-3 py-2 shadow-lg sm:px-12 sm:py-8 md:w-3/4 lg:w-1/2 xl:w-1/3'>
						<div className='lg:flex lg:items-center lg:justify-between'>
							<div className='min-w-0 flex-1'>
								<h1 className='text-accent text-xl/7 font-bold sm:truncate sm:text-2xl sm:tracking-tight'>
									Welcome Back!
								</h1>
								<span className='px-0.5 text-xs text-gray-400 sm:px-1 sm:text-sm'>
									Sign in to continue to your account.
								</span>
							</div>
						</div>
						<AuthenticationComponent />
					</div>
				</section>
			</main>
		</AuthContextProvider>
	)
}

export default AuthenticationPage
