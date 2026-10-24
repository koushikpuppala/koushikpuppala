import type { DeliveryNoticeProps } from 'types/components/client'
import Link from 'next/link'
import { Check, Copy, Mail } from 'components/icons'
import { DEFAULT_SUBJECT } from 'constants/contact'

export const DeliveryNotice = ({
	error,
	directEmail,
	values,
	copied,
	onCopy,
}: DeliveryNoticeProps) => {
	const mailto = directEmail
		? `mailto:${directEmail}?subject=${encodeURIComponent(values.subject || DEFAULT_SUBJECT)}&body=${encodeURIComponent(
				`Hi Koushik,\n\n${values.message}\n\nBest regards,\n${values.name}\n${values.email}`,
			)}`
		: null

	return (
		<div
			role='alert'
			className='border-destructive/50 bg-destructive/10 space-y-3 rounded-xl border p-4 text-left'>
			<div className='text-destructive flex items-start gap-2.5 text-sm'>
				<span className='font-semibold'>Delivery notice:</span>
				<span>{error}</span>
			</div>

			<div className='border-destructive/20 flex flex-wrap items-center gap-2 border-t pt-1'>
				{mailto ? (
					<Link
						href={mailto}
						className='border-destructive/30 bg-destructive/20 text-destructive hover:bg-destructive/30 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors'>
						<Mail className='size-3.5' />
						<span>Open in Email Client (Prefilled)</span>
					</Link>
				) : null}
				<button
					type='button'
					onClick={onCopy}
					className='border-border bg-surface text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors'>
					{copied ? (
						<>
							<Check className='text-success size-3.5' />
							<span>Draft Copied!</span>
						</>
					) : (
						<>
							<Copy className='size-3.5' />
							<span>Copy Draft Text</span>
						</>
					)}
				</button>
			</div>
		</div>
	)
}
