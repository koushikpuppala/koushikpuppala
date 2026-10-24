import type { MetadataFieldsProps } from 'types/components/admin'
import Image from 'next/image'
import { SITE_URL } from 'constants/site-url'
import { Eye, Image as ImageIcon, Share2 } from 'components/icons'

const HEADING =
	'text-muted-foreground flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider uppercase'

export const MetadataPreviews = ({ form }: Pick<MetadataFieldsProps, 'form'>) => (
	<div className='space-y-6'>
		<div className='border-border bg-surface space-y-3 rounded-2xl border p-5 shadow-xs'>
			<h3 className={HEADING}>
				<Eye className='size-3.5' />
				Google Search SERP Preview
			</h3>
			<div className='border-border bg-background space-y-1.5 rounded-xl border p-4 text-left'>
				<div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
					<div className='flex size-3.5 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] font-bold text-emerald-500'>
						K
					</div>
					<span className='max-w-50 truncate'>{form.canonicalUrl}</span>
				</div>
				<h4 className='line-clamp-1 cursor-pointer text-sm font-medium text-blue-500 hover:underline'>
					{form.title || 'Page Title'}
				</h4>
				<p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
					{form.description || 'Page meta description will appear in Google index results...'}
				</p>
			</div>
		</div>

		<div className='border-border bg-surface space-y-3 rounded-2xl border p-5 shadow-xs'>
			<h3 className={HEADING}>
				<Share2 className='size-3.5' />
				Social OpenGraph Card
			</h3>
			<div className='border-border bg-background overflow-hidden rounded-xl border text-left'>
				<div className='bg-surface/70 border-border relative flex aspect-1200/630 items-center justify-center overflow-hidden border-b'>
					{form.ogImage ? (
						<Image
							src={form.ogImage}
							alt='OG Preview'
							fill
							sizes='400px'
							className='object-cover'
						/>
					) : (
						<div className='text-muted-foreground flex flex-col items-center justify-center p-4 text-center'>
							<ImageIcon className='mb-2 size-8 opacity-50' />
							<span className='text-xs'>No OG Image specified</span>
						</div>
					)}
				</div>
				<div className='space-y-1 p-3'>
					<p className='text-muted-foreground font-mono text-[10px] font-semibold uppercase'>
						{new URL(SITE_URL).host}
					</p>
					<p className='text-foreground line-clamp-1 text-xs font-semibold'>{form.title}</p>
					<p className='text-muted-foreground line-clamp-2 text-[11px]'>{form.description}</p>
				</div>
			</div>
		</div>
	</div>
)
