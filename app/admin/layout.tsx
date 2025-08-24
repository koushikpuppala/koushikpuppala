import 'react-date-range/dist/styles.css'
import 'styles/react-date-range.css'

import type { Metadata } from 'next'
import type { RootLayoutProps } from 'types/app'

import dayjs from 'dayjs'
import { Sidebar } from 'components/sidebar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { AuthContextProvider } from 'contexts'

dayjs.extend(localizedFormat)

export const metadata: Metadata = {
	title: { default: 'Admin Portal', template: '%s | Admin Portal' },
	openGraph: { title: { default: 'Admin Portal', template: '%s | Admin Portal' } },
	twitter: { title: { default: 'Admin Portal', template: '%s | Admin Portal' } },
}

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<AuthContextProvider>
			<main className='flex h-screen w-full flex-col gap-0.5 p-0.5 lg:flex-row lg:gap-1 lg:p-1.5'>
				<Sidebar />
				<section className='h-full w-full overflow-hidden overflow-y-auto rounded-md bg-neutral-800 bg-cover bg-center bg-no-repeat px-4 py-2'>
					{children}
				</section>
			</main>
		</AuthContextProvider>
	)
}

export default RootLayout
