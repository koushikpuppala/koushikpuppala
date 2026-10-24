import type { OpenGraphCardProps } from 'types/components/admin'
import Image from 'next/image'
import { Button } from 'ui/button'
import { Image as ImageIcon } from 'components/icons'

// There is no free URL field: the API only accepts uploaded media served from the CDN.
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
			<Button type='button' variant='outline' onClick={onPick}>
				{form.ogImage ? 'Change image' : 'Choose from media library'}
			</Button>
			{form.ogImage && (
				<Button type='button' variant='ghost' onClick={() => setField('ogImage', '')}>
					Remove
				</Button>
			)}
		</div>

		{form.ogImage && (
			<div className='border-border bg-background relative aspect-1200/630 max-w-md overflow-hidden rounded-lg border'>
				<Image src={form.ogImage} alt='OG Preview' fill sizes='448px' className='object-cover' />
			</div>
		)}
	</div>
)
