import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPageMetadata } from '../../lib/metadata-data'

export const metadata: Metadata = getPageMetadata('education')

export default function EducationPage() {
	redirect('/#education')
}
