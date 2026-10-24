import type { PathnamePickerProps } from 'types/components/admin'
import { Input } from 'ui/input'
import { Badge } from 'components/ui/badge'
import { classNames } from 'utils/classNames'
import { Field } from 'components/form/field'
import { PATHNAME_PRESETS } from './settings-presets'

export const PathnamePicker = ({ form, setField, routeRecords, onSelect }: PathnamePickerProps) => (
	<div className='border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-xs'>
		<div className='flex items-center justify-between'>
			<div>
				<h2 className='text-foreground text-sm font-semibold tracking-tight'>
					Target Page Pathname
				</h2>
				<p className='text-muted-foreground text-xs'>
					Select a page route to configure or type a custom pathname key.
				</p>
			</div>
			<Badge variant='signal' className='font-mono text-xs'>
				{form.key}
			</Badge>
		</div>

		<div className='flex flex-wrap gap-2'>
			{PATHNAME_PRESETS.map(preset => (
				<button
					key={preset.key}
					type='button'
					onClick={() => onSelect(preset.key)}
					className={classNames(
						'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors',
						form.key === preset.key
							? 'border-signal bg-signal/15 text-signal-ink font-semibold'
							: 'border-border/80 bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground',
					)}>
					<span>{preset.key}</span>
					{routeRecords.some(record => record.key === preset.key) && (
						<span className='size-1.5 rounded-full bg-emerald-500' title='Saved in DB' />
					)}
				</button>
			))}
		</div>

		<Field id='settings-key' label='Custom Pathname Key' className='pt-1' required>
			<Input
				id='settings-key'
				required
				placeholder='/custom-path'
				value={form.key}
				onChange={e => setField('key', e.target.value)}
				className='font-mono text-xs'
			/>
		</Field>
	</div>
)
