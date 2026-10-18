import Link from 'next/link'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Button, buttonVariants } from './button'
import { render, screen } from '@testing-library/react'

describe('Button', () => {
	it('renders a button and handles clicks', async () => {
		const onClick = vi.fn()
		render(<Button onClick={onClick}>Save</Button>)

		await userEvent.click(screen.getByRole('button', { name: 'Save' }))

		expect(onClick).toHaveBeenCalledOnce()
	})

	it('does not fire when disabled', async () => {
		const onClick = vi.fn()
		render(
			<Button disabled onClick={onClick}>
				Save
			</Button>,
		)

		await userEvent.click(screen.getByRole('button', { name: 'Save' }))

		expect(onClick).not.toHaveBeenCalled()
	})

	it('applies variant and size classes, and lets className win conflicts', () => {
		render(
			<Button variant='destructive' size='sm' className='h-12'>
				Delete
			</Button>,
		)

		const button = screen.getByRole('button', { name: 'Delete' })
		expect(button).toHaveClass('bg-destructive', 'text-xs', 'h-12')
		expect(button).not.toHaveClass('h-8')
	})

	it('styles its child instead of nesting a button when asChild is set', () => {
		render(
			<Button asChild variant='outline'>
				<Link href='/projects'>All projects</Link>
			</Button>,
		)

		const link = screen.getByRole('link', { name: 'All projects' })
		expect(link).toHaveClass('border')
		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	it('exposes the same classes through buttonVariants', () => {
		expect(buttonVariants({ variant: 'ghost', size: 'icon' })).toContain('h-9 w-9')
	})
})
