import type {
	AttentionItem,
	AttentionSource,
	AttentionState,
	DashboardBlocks,
} from 'types/components/admin'

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many)

export const buildAttention = ({
	contacts,
	projects,
	health,
}: Pick<DashboardBlocks, 'contacts' | 'projects' | 'health'>): AttentionState => {
	const items: AttentionItem[] = []

	const unread = contacts.data?.unread ?? 0

	if (unread > 0)
		items.push({
			id: 'unread',
			label: plural(unread, 'unread message', 'unread messages'),
			count: unread,
			href: '/messages',
			tone: 'signal',
		})

	const unpublished = projects.data ? Math.max(0, projects.data.total - projects.data.published) : 0

	if (unpublished > 0)
		items.push({
			id: 'unpublished',
			label: plural(unpublished, 'unpublished project', 'unpublished projects'),
			count: unpublished,
			href: '/content/projects',
			tone: 'signal',
		})

	const services = health.data?.health.services

	if (services?.database !== undefined && services.database !== 'up')
		items.push({
			id: 'database-down',
			label: 'PostgreSQL is down',
			href: '/api-metrics',
			tone: 'destructive',
		})

	if (services?.redis !== undefined && services.redis !== 'up')
		items.push({
			id: 'redis-down',
			label: 'Redis is down',
			href: '/api-metrics',
			tone: 'destructive',
		})

	if (health.status === 'error')
		items.push({
			id: 'health-unreachable',
			label: 'Health check unreachable',
			href: '/api-metrics',
			tone: 'destructive',
		})

	const sources = [contacts, projects, health]
	const unavailable: AttentionSource[] = []

	if (contacts.status === 'error') unavailable.push('contacts')
	if (projects.status === 'error') unavailable.push('projects')

	return {
		items,
		loading: sources.filter(source => source.status === 'loading').length,
		unavailable,
		clear: items.length === 0 && sources.every(source => source.status === 'ready'),
	}
}
