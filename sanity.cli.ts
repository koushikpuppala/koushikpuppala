import { config } from '@import/config'
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({ api: { projectId: config.projectId, dataset: config.dataset } })
