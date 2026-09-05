import type { Metadata } from 'next'
import { Noise, FineGrid } from 'ui/background'
import { AmbientBloom, BrandWatermark } from 'ui/brand'
import { HeroSection } from '../components/hero'
import {
	ProjectsSection,
	ExperienceSection,
	SkillsSection,
	AboutSection,
	EducationSection,
	ResumeSection,
	ContactSection,
	SectionRail,
} from '../components/sections'
import { PublicFooter } from '../components/footer'
import {
	DEFAULT_KEYWORDS,
	DEFAULT_OG_IMAGE,
	SITE_DOMAIN,
	TWITTER_HANDLE,
} from '../lib/metadata-data'

export const metadata: Metadata = {
	title: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
	description:
		'Personal portfolio and engineering showcase of Koushik Puppala. Architecting distributed backends, performant web applications, and resilient cloud systems.',
	keywords: DEFAULT_KEYWORDS,
	alternates: {
		canonical: SITE_DOMAIN,
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: SITE_DOMAIN,
		siteName: 'Koushik Puppala',
		title: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
		description:
			'Personal portfolio and engineering showcase of Koushik Puppala. Architecting distributed backends, performant web applications, and resilient cloud systems.',
		images: [
			{
				url: DEFAULT_OG_IMAGE,
				width: 1200,
				height: 630,
				alt: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
		description:
			'Personal portfolio and engineering showcase of Koushik Puppala. Architecting distributed backends, performant web applications, and resilient cloud systems.',
		site: TWITTER_HANDLE,
		creator: TWITTER_HANDLE,
		images: [DEFAULT_OG_IMAGE],
	},
}

const personAndWebsiteJsonLd = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'Person',
			'@id': `${SITE_DOMAIN}/#person`,
			name: 'Koushik Puppala',
			jobTitle: 'Senior Full-Stack & AI Systems Engineer',
			url: SITE_DOMAIN,
			image: DEFAULT_OG_IMAGE,
			sameAs: [
				'https://github.com/koushikpuppala',
				'https://www.linkedin.com/in/koushikpuppala',
				'https://twitter.com/puppala_koushik',
			],
			worksFor: {
				'@type': 'Organization',
				name: 'Upraised',
			},
			alumniOf: {
				'@type': 'EducationalOrganization',
				name: 'Indian Institute of Information Technology Raichur',
			},
			knowsAbout: [
				'TypeScript',
				'Next.js 16',
				'NestJS 11',
				'PostgreSQL',
				'Redis',
				'AWS',
				'Distributed Systems',
			],
		},
		{
			'@type': 'WebSite',
			'@id': `${SITE_DOMAIN}/#website`,
			url: SITE_DOMAIN,
			name: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
			description:
				'Personal portfolio and engineering showcase of Koushik Puppala. Architecting distributed backends, performant web applications, and resilient cloud systems.',
			publisher: {
				'@id': `${SITE_DOMAIN}/#person`,
			},
		},
	],
}

export default function HomePage() {
	return (
		<div className='relative min-h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300'>
			{/* Schema.org Person and WebSite Structured Data */}
			<script type='application/ld+json'>
				{JSON.stringify(personAndWebsiteJsonLd).replace(/</g, '\\u003c')}
			</script>
			{/* Film Grain Noise Overlay */}
			<Noise />

			{/* Ambient Bloom Top Center */}
			<AmbientBloom size='xl' position='top-center' intensity='normal' />

			{/* Background Fine Grid with Radial Fade Mask */}
			<FineGrid mask='radial' opacity={0.35} />

			{/* Brand Watermark in Background */}
			<BrandWatermark className='-top-20 -right-20 pointer-events-none' size={720} opacity={0.03} />

			{/* Desktop Section Navigation Rail */}
			<SectionRail />

			<main className='relative z-10 w-full pt-20 sm:pt-24'>
				{/* Flagship Hero Section + Technical Brand Orbit */}
				<HeroSection />

				{/* Section 01: Selected Projects & Systems Architecture */}
				<ProjectsSection />

				{/* Section 02: Career Trajectory & Engineering Roles */}
				<ExperienceSection />

				{/* Section 03: Core Competencies & Technology Matrix */}
				<SkillsSection />

				{/* Section 04: Engineering Philosophy & System Thinking */}
				<AboutSection />

				{/* Section 05: Academic Background & Continuous Study */}
				<EducationSection />

				{/* Section 06: Authoritative Resume & Professional Summary */}
				<ResumeSection />

				{/* Section 07: Transmission & Direct Inquiries */}
				<ContactSection />
			</main>

			{/* Authoritative Lovable Portfolio Footer */}
			<PublicFooter />
		</div>
	)
}
