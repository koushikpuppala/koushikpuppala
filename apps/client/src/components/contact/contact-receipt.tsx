import type { ContactReceiptCardProps, ReceiptRowProps } from 'types/components/client'
import Link from 'next/link'
import { Button } from 'ui/button'
import { CheckCircle2, Sparkles } from 'components/icons'

const Row = ({ label, value, last }: ReceiptRowProps) => (
	<div
		className={
			last
				? 'flex items-center justify-between'
				: 'border-border flex items-center justify-between border-b pb-2'
		}>
		<span className='text-muted-foreground text-[0.625rem] uppercase'>{label}</span>
		<span className='text-foreground max-w-50 truncate'>{value}</span>
	</div>
)

export const ContactReceiptCard = ({ receipt, onReset }: ContactReceiptCardProps) => (
	<div className='panel flex flex-col items-center justify-center space-y-6 rounded-2xl p-8 text-center sm:p-12'>
		<div className='relative'>
			<div className='bg-success/15 border-success/30 grid size-16 place-items-center rounded-2xl border'>
				<CheckCircle2 className='text-success size-9' aria-hidden />
			</div>
			<Sparkles className='text-signal-ink absolute -top-1 -right-1 size-5 animate-pulse' />
		</div>

		<div className='space-y-2'>
			<h2 className='font-display text-foreground text-2xl font-semibold tracking-tight sm:text-3xl'>
				Message Dispatched!
			</h2>
			<p className='text-muted-foreground max-w-md text-sm leading-relaxed'>
				Thank you, <strong className='text-foreground'>{receipt.name}</strong>. Your message is in
				my inbox.
			</p>
		</div>

		<div className='border-border bg-surface/60 w-full max-w-md space-y-2.5 rounded-xl border p-4 text-left font-mono text-xs'>
			{receipt.id ? <Row label='Reference' value={receipt.id} /> : null}
			<Row label='Time' value={receipt.timestamp} />
			<Row label='Sender' value={receipt.email} />
			<Row label='Subject' value={receipt.subject} last />
		</div>

		<div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
			<Button variant='outline' onClick={onReset}>
				Send another message
			</Button>
			<Button asChild variant='default'>
				<Link href='/projects'>Explore Selected Projects</Link>
			</Button>
		</div>
	</div>
)
