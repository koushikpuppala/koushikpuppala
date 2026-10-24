import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingRegion, Skeleton, SkeletonText } from './skeleton'

describe('Skeleton', () => {
	it('announces one loading message for the whole region', () => {
		render(
			<LoadingRegion label='projects'>
				<Skeleton className='h-6 w-20' />
				<SkeletonText lines={3} />
			</LoadingRegion>,
		)

		const region = screen.getByRole('status')
		expect(region).toHaveAttribute('aria-busy', 'true')
		expect(region).toHaveTextContent('Loading projects')
	})

	it('hides placeholder blocks from assistive technology', () => {
		const { container } = render(<Skeleton className='h-6 w-20' />)

		expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
		expect(container.firstElementChild?.className).toContain('skeleton')
	})
})
