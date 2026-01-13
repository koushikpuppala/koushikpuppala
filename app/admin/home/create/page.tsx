import Link from 'next/link'
import { Fragment } from 'react'
import { AdminHomeCreateComponent } from 'components/admin'

const AdminCreateHomePage = async () => {
	return (
		<Fragment>
			<div className='lg:flex lg:items-center lg:justify-between'>
				<div className='min-w-0 flex-1'>
					<h1 className='text-accent text-xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight'>
						Create New Home Page Entry
					</h1>
					<span className='px-0.5 text-xs text-neutral-400 sm:px-1 sm:text-sm'>
						Add a new entry to customize your application&apos;s home page.
					</span>
				</div>

				<div className='mt-4 flex lg:mt-0 lg:ml-4'>
					<Link
						href='/admin/home'
						rel='noopener noreferrer'
						className='bg-accent hover:bg-accent/80 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm outline-none'>
						Back to Home Page Entries
					</Link>
				</div>
			</div>
			<div className='flex-1 overflow-y-auto py-2'>
				<AdminHomeCreateComponent />
			</div>
		</Fragment>
	)
}

export default AdminCreateHomePage
