/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from 'sanity/cli'
import { config } from '@import/config'

export default defineCliConfig({
	api: {
		projectId: config.projectId,
		dataset: config.dataset,
	},
})
