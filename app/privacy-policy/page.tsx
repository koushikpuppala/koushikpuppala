import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Privacy Policy',
	openGraph: { title: 'Privacy Policy' },
	twitter: { title: 'Privacy Policy' },
}

const PrivacyPolicyPage = () => {
	return (
		<main className='text-white-100 mx-auto flex h-screen w-full justify-center overflow-y-auto px-4 py-10'>
			<div className=''>
				<section className='flex max-w-3xl flex-col items-start justify-start space-y-3'>
					<div className='flex w-full flex-col items-center justify-between pb-4 md:flex-row'>
						<h1 className='text-3xl font-bold sm:text-4xl'>Privacy Policy</h1>
						<p className='text-xs text-gray-400 sm:text-sm'>Effective Date: April 25, 2025</p>
					</div>

					<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
						<h2 className='text-lg font-semibold sm:text-2xl'>1. Information We Collect</h2>
						<p className='text-sm sm:text-base'>
							When you sign in using <strong>Google Sign-In</strong>, we may collect the following
							information:
						</p>
						<ul className='list-inside list-disc space-y-1 text-sm sm:text-base'>
							<li>Your name</li>
							<li>Your email address</li>
							<li>Your profile picture (if authorized)</li>
						</ul>
						<p className='text-sm sm:text-base'>
							We only access data that you explicitly grant permission for during the sign-in
							process.
						</p>
					</div>

					<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
						<h2 className='text-lg font-semibold sm:text-2xl'>2. How We Use Your Information</h2>
						<p className='text-sm sm:text-base'>We use your data to:</p>
						<ul className='list-inside list-disc space-y-1 text-sm sm:text-base'>
							<li>Authenticate your identity</li>
							<li>Personalize your experience on the website</li>
							<li>Restrict access to authenticated features</li>
						</ul>
						<p className='text-sm sm:text-base'>
							Your information is <strong>never sold or shared</strong> with third parties.
						</p>
					</div>

					<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
						<h2 className='text-lg font-semibold sm:text-2xl'>3. Data Storage & Security</h2>
						<p className='text-sm sm:text-base'>
							All user data is securely stored and protected using industry-standard security
							practices to prevent unauthorized access or misuse.
						</p>
					</div>

					<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
						<h2 className='text-lg font-semibold sm:text-2xl'>4. Third-Party Services</h2>
						<p className='text-sm sm:text-base'>
							We use <strong>Google OAuth 2.0</strong> for sign-in functionality. By using this
							feature, you also agree to the{' '}
							<Link
								href='https://policies.google.com/privacy'
								target='_blank'
								rel='noopener noreferrer'
								className='text-accent hover:text-accent/80'>
								Google Privacy Policy
							</Link>
							.
						</p>
					</div>

					<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
						<h2 className='text-lg font-semibold sm:text-2xl'>5. Your Rights</h2>
						<p className='text-sm sm:text-base'>
							You may revoke access to your data at any time through your Google Account settings.
							For requests such as data deletion or other inquiries, please use the{' '}
							<Link
								href='/contact'
								target='_blank'
								rel='noopener noreferrer'
								className='text-accent hover:text-accent/80'>
								contact form
							</Link>{' '}
							provided on this website.
						</p>
					</div>

					<div className='flex w-full flex-col items-start justify-start space-y-2 pb-4'>
						<h2 className='text-lg font-semibold sm:text-2xl'>6. Changes to This Policy</h2>
						<p className='text-sm sm:text-base'>
							This policy may be updated from time to time. Any changes will be reflected on this
							page with the updated effective date.
						</p>
					</div>

					<div className='flex w-full flex-col items-start justify-start space-y-2 pb-28 lg:pb-4'>
						<h2 className='text-lg font-semibold sm:text-2xl'>7. Contact</h2>
						<p className='text-sm sm:text-base'>
							If you have any questions or concerns regarding this Privacy Policy, please reach out
							through the{' '}
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
			</div>
		</main>
	)
}

export default PrivacyPolicyPage
