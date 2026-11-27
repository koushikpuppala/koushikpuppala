import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Textarea } from 'ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'ui/designs/table'
import { Badge } from 'components/ui/badge'
import { DesignSection } from 'components/design/design-section'
import {
	CONTROL_STEPS,
	RADIUS_STEPS,
	SAMPLE_ROWS,
	SWATCHES,
	TEXT_STEPS,
} from 'components/design/design-tokens'
import { classNames } from 'utils/classNames'

export const DesignSystemView = () => {
	return (
		<div className='flex flex-col gap-8 pb-12'>
			<header className='flex flex-col gap-1'>
				<h1 className='text-headline'>Design tokens</h1>
				<p className='text-body text-muted-foreground'>
					Every value below comes from a token. Switch the theme to check light and dark.
				</p>
			</header>

			<DesignSection
				title='Color'
				description='Semantic colors. Control borders use the input token.'>
				<ul className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
					{SWATCHES.map(swatch => (
						<li key={swatch.name} className='flex flex-col gap-1.5'>
							<div
								className={classNames(
									'border-border h-12 rounded-md border',
									swatch.swatchClassName,
								)}
							/>
							<span className='text-caption font-medium'>{swatch.name}</span>
							{swatch.note && (
								<span className='text-caption text-muted-foreground'>{swatch.note}</span>
							)}
						</li>
					))}
				</ul>
			</DesignSection>

			<DesignSection
				title='Type'
				description='Six steps, none below 12px. Numbers use tabular digits.'>
				<ul className='flex flex-col gap-3'>
					{TEXT_STEPS.map(step => (
						<li key={step.name} className='flex flex-wrap items-baseline gap-x-4 gap-y-1'>
							<span className='text-caption text-muted-foreground numeric w-32 shrink-0'>
								{step.name} {step.size}
							</span>
							<span className={step.className}>The quick brown fox jumps over 0123456789</span>
						</li>
					))}
				</ul>
			</DesignSection>

			<DesignSection
				title='Radius and depth'
				description='One radius family and one overlay shadow.'>
				<div className='flex flex-wrap gap-4'>
					{RADIUS_STEPS.map(step => (
						<div key={step.name} className='flex flex-col items-center gap-1.5'>
							<div
								className={classNames('border-input bg-surface size-16 border', step.className)}
							/>
							<span className='text-caption'>{step.name}</span>
						</div>
					))}
					<div className='flex flex-col items-center gap-1.5'>
						<div className='border-border bg-surface shadow-overlay size-16 rounded-lg border' />
						<span className='text-caption'>shadow-overlay</span>
					</div>
				</div>
			</DesignSection>

			<DesignSection
				title='Controls'
				description='Heights 32, 36 and 40px. Focus a control with Tab.'>
				<div className='flex flex-wrap items-center gap-3'>
					<Button size='sm'>Small</Button>
					<Button>Medium</Button>
					<Button size='lg'>Large</Button>
					<Button variant='outline'>Outline</Button>
					<Button variant='ghost'>Ghost</Button>
					<Button variant='destructive'>Destructive</Button>
				</div>
				<ul className='grid gap-3 sm:grid-cols-3'>
					{CONTROL_STEPS.map(step => (
						<li key={step.name} className='flex flex-col gap-1.5'>
							<span className='text-caption text-muted-foreground numeric'>
								{step.name} {step.height}px
							</span>
							<Input
								aria-label={`${step.name} sample`}
								placeholder='Type here'
								className={step.className}
							/>
						</li>
					))}
				</ul>
			</DesignSection>

			<DesignSection title='Form' description='Label, input and textarea on the control tokens.'>
				<div className='flex max-w-md flex-col gap-4'>
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor='design-title'>Title</Label>
						<Input id='design-title' placeholder='Type here' />
					</div>
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor='design-notes'>Notes</Label>
						<Textarea id='design-notes' placeholder='Longer text' />
					</div>
					<Button type='button' className='self-start'>
						Save
					</Button>
				</div>
			</DesignSection>

			<DesignSection title='Table' description='Rows are 40px. Counts use tabular digits.'>
				<div className='border-border rounded-lg border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Count</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{SAMPLE_ROWS.map(row => (
								<TableRow key={row.id}>
									<TableCell>{row.name}</TableCell>
									<TableCell>
										<Badge variant={row.status === 'Published' ? 'success' : 'warning'}>
											{row.status}
										</Badge>
									</TableCell>
									<TableCell className='text-right'>{row.count}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</DesignSection>
		</div>
	)
}
