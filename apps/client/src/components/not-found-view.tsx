import type { NotFoundViewProps } from 'types/components/client'

import Link from 'next/link'
import { ArrowRight } from 'components/icons'
import { SiteShell } from 'components/site-shell'
import { Button } from 'ui/button'
import { getSocialsData } from 'lib/social-data'

export const NotFoundView = async ({ eyebrow, title, description, primary }: NotFoundViewProps) => {
	const socials = await getSocialsData()

	return (
		<SiteShell socials={socials}>
			<section className='container-page flex min-h-[70vh] flex-col justify-center py-32'>
				<p className='text-eyebrow text-signal-ink'>{eyebrow}</p>
				<h1 className='font-display text-foreground mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl'>
					{title}
				</h1>
				<p className='text-muted-foreground mt-5 max-w-xl leading-relaxed'>{description}</p>
				<div className='mt-10 flex flex-wrap gap-3'>
					<Button asChild size='lg' variant='signal' className='group'>
						<Link href={primary.href}>
							{primary.label} <ArrowRight className='arrow-slide size-4' />
						</Link>
					</Button>
					<Button asChild size='lg' variant='outline'>
						<Link href='/'>Home</Link>
					</Button>
					<Button asChild size='lg' variant='ghost'>
						<Link href='/contact'>Contact</Link>
					</Button>
				</div>
			</section>
		</SiteShell>
	)
}
