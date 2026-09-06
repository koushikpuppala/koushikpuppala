import type { ReactNode } from 'react'
import { PageContainer, SectionContainer } from 'ui/container'
import { FineGrid, MicroGrid, DotGrid } from 'ui/background'
import { AmbientBloom } from 'ui/brand'
import { classNames } from '../../lib/utils'

export type SectionBackgroundVariant =
	| 'clean'
	| 'finegrid'
	| 'microgrid'
	| 'dotgrid'
	| 'bloom-top'
	| 'bloom-bottom'

export type SectionFrameProps = {
	id: string
	children: ReactNode
	background?: SectionBackgroundVariant
	spacing?: 'tight' | 'normal' | 'generous'
	borderTop?: boolean
	className?: string
}

/**
 * SectionFrame
 * Reusable layout wrapper providing consistent vertical rhythm, background texture transitions,
 * accessibility landmarking, and anchor scroll offsets.
 */
export const SectionFrame = ({
	id,
	children,
	background = 'clean',
	spacing = 'normal',
	borderTop = true,
	className,
}: SectionFrameProps) => {
	return (
		<SectionContainer
			id={id}
			spacing={spacing}
			className={classNames(
				'scroll-mt-24 sm:scroll-mt-28 overflow-hidden transition-colors duration-300',
				borderTop && 'border-t border-border/50',
				className,
			)}>
			{/* Subtle Background Transitions */}
			{background === 'finegrid' && (
				<FineGrid mask='radial' opacity={0.2} className='pointer-events-none' />
			)}
			{background === 'microgrid' && <MicroGrid opacity={0.2} className='pointer-events-none' />}
			{background === 'dotgrid' && (
				<DotGrid mask='radial' opacity={0.25} className='pointer-events-none' />
			)}
			{background === 'bloom-top' && (
				<AmbientBloom
					size='lg'
					position='top-center'
					intensity='subtle'
					className='pointer-events-none'
				/>
			)}
			{background === 'bloom-bottom' && (
				<AmbientBloom
					size='md'
					position='bottom-left'
					intensity='subtle'
					className='pointer-events-none'
				/>
			)}

			<PageContainer className='relative z-10'>{children}</PageContainer>
		</SectionContainer>
	)
}
