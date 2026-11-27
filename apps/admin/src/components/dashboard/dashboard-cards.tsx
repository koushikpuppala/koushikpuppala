import type { DashboardCardsProps } from 'types/components/admin'
import { Badge } from 'components/ui/badge'
import { StatCard } from 'components/dashboard/stat-card'
import { Activity, FolderKanban, Image as ImageIcon, Inbox } from 'components/icons'

const ICON = 'text-signal-ink size-4'

export const DashboardCards = ({ blocks }: DashboardCardsProps) => {
	const { projects, contacts, media, audits } = blocks

	return (
		<div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
			<StatCard
				label='Projects'
				icon={<FolderKanban aria-hidden className={ICON} />}
				status={projects.status}
				value={projects.data?.total ?? null}
				badge={<Badge variant='success'>{projects.data?.published ?? 0} published</Badge>}
				href='/content/projects'
				linkLabel='Manage projects'
			/>
			<StatCard
				label='Messages'
				icon={<Inbox aria-hidden className={ICON} />}
				status={contacts.status}
				value={contacts.data?.total ?? null}
				badge={
					contacts.data && contacts.data.unread > 0 ? (
						<Badge variant='signal'>{contacts.data.unread} unread</Badge>
					) : (
						<Badge variant='secondary'>All read</Badge>
					)
				}
				href='/messages'
				linkLabel='Open inbox'
			/>
			<StatCard
				label='Media'
				icon={<ImageIcon aria-hidden className={ICON} />}
				status={media.status}
				value={media.data}
				badge={<Badge variant='outline'>AWS S3</Badge>}
				href='/media'
				linkLabel='Media library'
			/>
			<StatCard
				label='Changes logged'
				icon={<Activity aria-hidden className={ICON} />}
				status={audits.status}
				value={audits.data?.total ?? null}
				badge={<Badge variant='secondary'>Audited</Badge>}
				href='/audit-logs'
				linkLabel='View activity logs'
			/>
		</div>
	)
}
