import { LoadingRegion, Skeleton } from 'ui/skeleton'
import { LogoMark } from 'ui/logo'

const LoginLoading = () => {
	return (
		<LoadingRegion
			label='sign in'
			className='flex min-h-[85vh] items-center justify-center px-4 py-12'>
			<div className='w-full max-w-md space-y-8'>
				<div className='flex flex-col items-center gap-3'>
					<LogoMark className='size-12 rounded-2xl shadow-lg' />
					<Skeleton className='h-7 w-48' />
					<Skeleton className='h-3 w-64' />
				</div>
				<div className='border-border bg-surface space-y-5 rounded-2xl border p-7 shadow-xl sm:p-9'>
					<Skeleton className='h-3 w-28' />
					<Skeleton className='h-10 w-full rounded-lg' />
					<Skeleton className='h-3 w-36' />
					<Skeleton className='h-10 w-full rounded-lg' />
					<Skeleton className='h-10 w-full rounded-lg' />
					<Skeleton className='h-10 w-full rounded-lg' />
				</div>
			</div>
		</LoadingRegion>
	)
}

export default LoginLoading
