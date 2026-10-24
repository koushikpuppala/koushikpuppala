import type { MetadataFieldsProps } from 'types/components/admin'
import { Input } from 'ui/input'
import { Select } from 'ui/select'
import { Textarea } from 'ui/textarea'
import { Globe } from 'components/icons'
import { Field } from 'components/form/field'
import { ROBOTS_OPTIONS } from 'components/settings/settings-presets'

const HINT = 'text-muted-foreground text-[11px]'

export const SearchMetadataCard = ({ form, setField }: MetadataFieldsProps) => (
	<div className='border-border bg-surface space-y-5 rounded-2xl border p-6 shadow-xs'>
		<h2 className='text-foreground flex items-center gap-2 text-base font-semibold tracking-tight'>
			<Globe className='text-signal-ink size-4' />
			Search Engine Metadata
		</h2>

		<Field id='settings-title' label='Global Title Template' required>
			<Input
				id='settings-title'
				required
				placeholder='Page Title'
				value={form.title}
				onChange={e => setField('title', e.target.value)}
			/>
			<p className={HINT}>
				Optimal length: 50–60 characters. Current length: {form.title.length} chars.
			</p>
		</Field>

		<Field id='settings-description' label='Global Meta Description' required>
			<Textarea
				id='settings-description'
				required
				rows={3}
				placeholder='Summary for search engines...'
				value={form.description}
				onChange={e => setField('description', e.target.value)}
			/>
			<p className={HINT}>
				Optimal length: 140–160 characters. Current length: {form.description.length} chars.
			</p>
		</Field>

		<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
			<Field id='settings-canonical' label='Canonical Base URL' required>
				<Input
					id='settings-canonical'
					required
					placeholder='https://koushikpuppala.com'
					value={form.canonicalUrl}
					onChange={e => setField('canonicalUrl', e.target.value)}
				/>
			</Field>
			<Field id='settings-robots' label='Robots Directives'>
				<Select
					id='settings-robots'
					aria-label='Robots directives'
					value={form.robots}
					onChange={value => setField('robots', value)}
					options={ROBOTS_OPTIONS}
					className='text-sm'
				/>
			</Field>
		</div>
	</div>
)
