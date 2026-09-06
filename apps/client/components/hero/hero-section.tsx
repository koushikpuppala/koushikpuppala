import { Suspense } from 'react'
import { HeroClientView } from './hero-client'
import { getHomeData, AUTHORITATIVE_HOME, type PortfolioHome } from '../../lib/home-data'
import {
	getVisibleSocials,
	AUTHORITATIVE_SOCIALS,
	type PortfolioSocial,
} from '../../lib/social-data'

export type HeroSectionProps = {
	className?: string
	homeData?: PortfolioHome
	socials?: PortfolioSocial[]
}

async function HeroAsyncContent({ className, homeData, socials }: HeroSectionProps) {
	const [resolvedHome, resolvedSocials] = await Promise.all([
		homeData || getHomeData(),
		socials || getVisibleSocials(),
	])

	return <HeroClientView className={className} homeData={resolvedHome} socials={resolvedSocials} />
}

/**
 * HeroSection
 * Flagship Lovable Signal hero section.
 * Automatically fetches published homepage content and visible social channels from the backend API,
 * streaming seamlessly within a Suspense boundary and falling back to the authoritative dataset.
 */
export const HeroSection = ({ className, homeData, socials }: HeroSectionProps) => {
	return (
		<Suspense
			fallback={
				<HeroClientView
					className={className}
					homeData={homeData || AUTHORITATIVE_HOME}
					socials={socials || AUTHORITATIVE_SOCIALS}
				/>
			}>
			<HeroAsyncContent className={className} homeData={homeData} socials={socials} />
		</Suspense>
	)
}
