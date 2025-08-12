import type { Metadata } from 'next'

import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Terms of Service',
	openGraph: { title: 'Terms of Service' },
	twitter: { title: 'Terms of Service' },
}

const TermsOfServicePage = () => {
	return (
		<main className='mx-auto flex h-screen w-full justify-center overflow-y-auto px-4 py-10 text-white'>
			<section className='flex max-w-3xl flex-col items-start justify-start space-y-3'>
				<div className='flex w-full flex-col items-center justify-between pb-4 md:flex-row'>
					<h1 className='text-3xl font-bold sm:text-4xl'>Terms of Service</h1>
					<p className='text-xs text-gray-400 sm:text-sm'>Effective Date: April 25, 2025</p>
				</div>

				<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
					<h2 className='text-lg font-semibold sm:text-2xl'>1. Acceptance of Terms</h2>
					<p className='text-sm sm:text-base'>
						By accessing or using this website, you agree to be bound by these Terms of Service and
						all applicable laws and regulations. If you do not agree, please do not use this
						website.
					</p>
				</div>

				<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
					<h2 className='text-lg font-semibold sm:text-2xl'>2. Access & Usage</h2>
					<p className='text-sm sm:text-base'>
						This website is intended to showcase my work and portfolio. You may browse and view
						content freely, but unauthorized access to the admin dashboard is strictly prohibited.
					</p>
				</div>

				<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
					<h2 className='text-lg font-semibold sm:text-2xl'>3. Contact Form</h2>
					<p className='text-sm sm:text-base'>
						You may use the contact form to reach out for professional inquiries. Spam, promotional,
						or inappropriate messages are not permitted and may be blocked.
					</p>
				</div>

				<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
					<h2 className='text-lg font-semibold sm:text-2xl'>4. Intellectual Property</h2>
					<p className='text-sm sm:text-base'>
						All content on this website, including text, design, and code, is the intellectual
						property of Koushik Puppala unless otherwise stated. Unauthorized use is prohibited.
					</p>
				</div>

				<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
					<h2 className='text-lg font-semibold sm:text-2xl'>5. Limitation of Liability</h2>
					<p className='text-sm sm:text-base'>
						I do not guarantee the website will always be available or error-free. I am not
						responsible for any damages resulting from the use of this website.
					</p>
				</div>

				<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
					<h2 className='text-lg font-semibold sm:text-2xl'>6. Modifications</h2>
					<p className='text-sm sm:text-base'>
						I reserve the right to update or modify these terms at any time. Updates will be posted
						on this page with the effective date changed accordingly.
					</p>
				</div>

				<div className='flex w-full flex-col items-start justify-start space-y-2 pb-28 lg:pb-4'>
					<h2 className='text-lg font-semibold sm:text-2xl'>7. Contact</h2>
					<p className='text-sm sm:text-base'>
						If you have any questions about these Terms, please contact me via the{' '}
						<Link
							href='/contact'
							target='_blank'
							rel='noopener noreferrer'
							className='text-accent hover:text-accent/80'>
							contact form
						</Link>
						.
					</p>
				</div>
			</section>
		</main>
	)
}

export default TermsOfServicePage
