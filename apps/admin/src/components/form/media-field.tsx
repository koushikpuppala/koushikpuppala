import type { MediaFieldProps } from 'types/components/admin'
import { Button } from 'ui/button'
import { Label } from 'ui/label'
import { classNames } from 'utils/classNames'
import { Image as ImageIcon } from 'components/icons'

export const MediaField = ({
	label,
	url,
	alt,
	buttonLabel,
	onPick,
	hint,
	variant = 'compact',
}: MediaFieldProps) => {
	const large = variant === 'large'

	return (
		<div className='space-y-2'>
			<Label
				className={classNames(
					'text-xs',
					large && 'text-muted-foreground block font-mono uppercase',
				)}>
				{label}
			</Label>
			<div className={classNames('flex items-center', large ? 'gap-4' : 'gap-3')}>
				<div
					className={classNames(
						'bg-surface-strong border-border relative grid shrink-0 place-items-center overflow-hidden border',
						large ? 'size-20 rounded-2xl' : 'size-14 rounded-lg',
					)}>
					{url ? (
						<img src={url} alt={alt} className='size-full object-cover' />
					) : (
						<ImageIcon
							className={classNames('text-muted-foreground/40', large ? 'size-6' : 'size-5')}
						/>
					)}
				</div>
				<div className='space-y-2'>
					<Button type='button' variant='outline' size='sm' onClick={onPick}>
						{large && <ImageIcon className='size-3.5' />}
						<span>{buttonLabel}</span>
					</Button>
					{hint && <p className='text-muted-foreground font-mono text-[0.6875rem]'>{hint}</p>}
				</div>
			</div>
		</div>
	)
}
