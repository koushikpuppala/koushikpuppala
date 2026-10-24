import type { TopicPickerProps } from 'types/components/client'
import { Label } from 'ui/label'
import { classNames } from 'utils/classNames'
import { TOPIC_PRESETS } from 'components/contact/contact-options'

export const TopicPicker = ({ selected, onSelect }: TopicPickerProps) => (
	<div className='space-y-2.5'>
		<Label className='text-foreground text-sm font-medium'>What would you like to discuss?</Label>
		<div className='flex flex-wrap gap-2'>
			{TOPIC_PRESETS.map(topic => (
				<button
					key={topic.id}
					type='button'
					aria-pressed={selected?.id === topic.id}
					onClick={() => onSelect(topic)}
					className={classNames(
						'inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-all duration-200',
						selected?.id === topic.id
							? 'border-signal bg-signal/15 text-signal-ink font-semibold shadow-sm'
							: 'border-border bg-surface/50 text-muted-foreground hover:border-border-strong hover:bg-surface hover:text-foreground',
					)}>
					<span>{topic.icon}</span>
					<span>{topic.label}</span>
				</button>
			))}
		</div>
	</div>
)
