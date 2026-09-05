import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPageMetadata } from '../../lib/metadata-data'

export const metadata: Metadata = getPageMetadata('experience')

export default function ExperiencePage() {
	redirect('/#experience')
}
