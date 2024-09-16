import { defineConfig } from 'sanity'
import { config } from '@import/config'
import { schema } from '@import/schemas'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'
import { BetterAction, SanityImprovedAction } from '@import/types'

const sanityImprovedAction: SanityImprovedAction = (originalAction, context) => {
	const BetterAction: BetterAction = props => {
		const originalResult = originalAction(props)

		if (!originalResult) return originalResult

		return {
			...originalResult,
			onHandle: () => {
				if (originalResult.onHandle) originalResult.onHandle()
				fetch(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/validation`, {
					method: 'POST',
					body: JSON.stringify({ tag: context.schemaType }),
				})
			},
			label: originalResult.label + ' & Revalidate',
		}
	}

	return BetterAction
}

export default defineConfig({
	title: 'Sanity Studio | Koushik Puppala',
	basePath: '/studio',
	projectId: config.projectId,
	dataset: config.dataset,
	schema,
	plugins: [structureTool(), visionTool({ defaultApiVersion: config.apiVersion })],
	document: { actions: (prev, context) => prev.map(originalAction => sanityImprovedAction(originalAction, context)) },
})
