import { type SchemaTypeDefinition } from 'sanity'

import about from './about'
import education from './education'
import experience from './experience'
import home from './home'
import projects from './projects'
import services from './services'
import social from './social'

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [about, education, experience, home, projects, services, social],
}
