import { defineConfig } from 'sanity'
import { config } from '@import/config'
import { schema } from '@import/schemas'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'

export default defineConfig({
	title: 'Sanity Studio | Koushik Puppala',
	basePath: '/studio',
	projectId: config.projectId,
	dataset: config.dataset,
	schema,
	plugins: [structureTool(), visionTool({ defaultApiVersion: config.apiVersion })],
})
