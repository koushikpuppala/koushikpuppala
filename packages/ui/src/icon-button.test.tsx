import Link from 'next/link'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IconButton } from './icon-button'

describe('IconButton', () => {
	it('is a button named by its aria-label', () => {
		render(
			<IconButton aria-label='Edit project'>
				<svg />
			</IconButton>,
		)

		const button = screen.getByRole('button', { name: 'Edit project' })
		expect(button).toHaveAttribute('type', 'button')
		expect(button.className).toContain('text-muted-foreground')
	})

	it('applies the danger variant', () => {
		render(
			<IconButton aria-label='Delete project' variant='danger'>
				<svg />
			</IconButton>,
		)

		expect(screen.getByRole('button', { name: 'Delete project' }).className).toContain(
			'text-destructive',
		)
	})

	it('styles its child when asChild is set', () => {
		render(
			<IconButton asChild aria-label='Open project' variant='primary'>
				<Link href='/projects' className='own-class'>
					<svg />
				</Link>
			</IconButton>,
		)

		const link = screen.getByRole('link', { name: 'Open project' })
		expect(link.className).toContain('own-class')
		expect(link.className).toContain('text-signal-ink')
	})
})
