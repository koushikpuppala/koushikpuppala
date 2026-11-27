import type { DesignSectionProps } from 'types/components/admin'

export const DesignSection = ({ title, description, children }: DesignSectionProps) => {
	return (
		<section className='border-border flex flex-col gap-4 border-t pt-6'>
			<div className='flex flex-col gap-1'>
				<h2 className='text-title'>{title}</h2>
				<p className='text-body text-muted-foreground'>{description}</p>
			</div>
			{children}
		</section>
	)
}
