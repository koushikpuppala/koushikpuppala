import type { Metadata } from 'next'
import { SkillsContentClientView } from '@/components/views/skills-content-client-view'

export const metadata: Metadata = {
	title: 'Skills Content',
	description: 'Categorize and organize technical skills, proficiencies, tools, and platforms.',
}

export const SkillsContentPage = () => {
	return <SkillsContentClientView />
}

export default SkillsContentPage
