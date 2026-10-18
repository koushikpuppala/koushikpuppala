import type { OpenGraphCardProps } from 'types/components/admin'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Image as ImageIcon } from 'components/icons'

export const OpenGraphCard = ({ form, setField, onPick }: OpenGraphCardProps) => (
	<div className='border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-xs'>
		<h2 className='text-foreground flex items-center gap-2 text-base font-semibold tracking-tight'>
			<ImageIcon className='text-signal-ink size-4' />
			OpenGraph & Social Share Banner
		</h2>
		<p className='text-muted-foreground text-xs'>
			Default preview image displayed on Twitter, LinkedIn, Slack, and Facebook feeds (1200x630
			recommended).
		</p>

		<div className='flex items-center gap-3'>
			<Input
				placeholder='https://s3.../og-banner.webp'
				aria-label='OpenGraph image URL'
				value={form.ogImage}
				onChange={e => setField('ogImage', e.target.value)}
			/>
			<Button type='button' variant='outline' onClick={onPick}>
				Choose from S3
			</Button>
		</div>

		{form.ogImage && (
			<div className='border-border bg-background relative aspect-1200/630 max-w-md overflow-hidden rounded-lg border'>
				<img src={form.ogImage} alt='OG Preview' className='h-full w-full object-cover' />
			</div>
		)}
	</div>
)
