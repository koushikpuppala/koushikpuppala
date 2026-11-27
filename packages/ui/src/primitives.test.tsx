import { createRef } from 'react'
import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { Surface } from './surface'
import { PageContainer } from './container'
import { LogoGlyph, LogoMark } from './logo'
import { KeyboardFocus } from './keyboard-focus'
import { FilterControl } from './designs/filter-control'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './designs/table'

describe('form primitives', () => {
	it('labels an input and a textarea and forwards refs and props', async () => {
		const inputRef = createRef<HTMLInputElement>()
		const textareaRef = createRef<HTMLTextAreaElement>()
		render(
			<>
				<Label htmlFor='name'>Name</Label>
				<Input id='name' ref={inputRef} className='extra' placeholder='Your name' />
				<Label htmlFor='bio'>Bio</Label>
				<Textarea id='bio' ref={textareaRef} rows={3} />
			</>,
		)

		await userEvent.type(screen.getByLabelText('Name'), 'Ada')
		await userEvent.type(screen.getByLabelText('Bio'), 'Engines')

		expect(inputRef.current).toHaveValue('Ada')
		expect(inputRef.current).toHaveClass('extra')
		expect(textareaRef.current).toHaveValue('Engines')
		expect(textareaRef.current).toHaveAttribute('rows', '3')
	})
})

describe('layout primitives', () => {
	it.each(['flat', 'bordered', 'strong', 'transparent', 'card'] as const)(
		'renders a %s surface',
		variant => {
			render(
				<Surface variant={variant} interactive glow as='section' aria-label='panel'>
					Content
				</Surface>,
			)

			expect(screen.getByRole('region', { name: 'panel' })).toHaveTextContent('Content')
		},
	)

	it('renders a plain surface and a page container', () => {
		render(
			<PageContainer className='narrow'>
				<Surface>Inside</Surface>
			</PageContainer>,
		)

		expect(screen.getByText('Inside').parentElement).toHaveClass('narrow')
	})

	it('renders the logo glyph and mark as decorative images', () => {
		const { container } = render(
			<>
				<LogoGlyph />
				<LogoMark className='mark' glyphClassName='glyph' />
			</>,
		)

		expect(container.querySelectorAll('img')).toHaveLength(2)
		expect(container.querySelector('.mark img')).toHaveClass('glyph')
	})
})

// covers: AC-5, AC-2
describe('design token classes on shared components', () => {
	it('sizes an input from the medium control token and lets a caller pick another size', () => {
		render(
			<>
				<Input aria-label='default' />
				<Input aria-label='small' className='h-control-sm' />
				<Input aria-label='tall' className='h-12' />
			</>,
		)

		expect(screen.getByLabelText('default')).toHaveClass('h-control-md')
		expect(screen.getByLabelText('small')).toHaveClass('h-control-sm')
		expect(screen.getByLabelText('small')).not.toHaveClass('h-control-md')
		expect(screen.getByLabelText('tall')).toHaveClass('h-12')
		expect(screen.getByLabelText('tall')).not.toHaveClass('h-control-md')
	})

	it('draws input and textarea borders and fill from tokens, so the admin can retheme them', () => {
		render(
			<>
				<Input aria-label='one line' />
				<Textarea aria-label='many lines' />
			</>,
		)

		for (const field of [screen.getByLabelText('one line'), screen.getByLabelText('many lines')]) {
			expect(field).toHaveClass('border-input')
			expect(field).toHaveClass('bg-[color:var(--field-bg)]')
		}
	})

	it('shows keyboard focus on fields as an outline, not a thin ring', () => {
		render(<Input aria-label='focus' />)

		const field = screen.getByLabelText('focus')
		expect(field).toHaveClass('focus-ring:outline-2')
		expect(field).not.toHaveClass('focus-ring:ring-1')
	})

	it('reads the page width from the page token', () => {
		render(
			<PageContainer>
				<p>Inside</p>
			</PageContainer>,
		)

		expect(screen.getByText('Inside').parentElement).toHaveClass('max-w-page')
	})

	it('draws the surface glow from the shared glow variable', () => {
		render(
			<Surface glow aria-label='glow'>
				Glow
			</Surface>,
		)

		expect(screen.getByLabelText('glow').className).toContain('hover:shadow-[var(--shadow-glow)]')
	})

	it('gives table header and body cells the row height token', () => {
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Ada</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass('h-row')
		expect(screen.getByRole('cell', { name: 'Ada' })).toHaveClass('h-row')
	})
})

describe('KeyboardFocus', () => {
	it('marks keyboard use on Tab and clears it on pointer input', () => {
		const { unmount } = render(<KeyboardFocus />)
		const root = document.documentElement

		fireEvent.keyDown(window, { key: 'a' })
		expect(root.dataset.keyboard).toBeUndefined()

		fireEvent.keyDown(window, { key: 'Tab' })
		expect(root.dataset.keyboard).toBe('')

		fireEvent.pointerDown(window)
		expect(root.dataset.keyboard).toBeUndefined()

		unmount()
		fireEvent.keyDown(window, { key: 'Tab' })
		expect(root.dataset.keyboard).toBeUndefined()
	})
})

const options = [
	{ label: 'Published', value: 'PUBLISHED' },
	{ label: 'Draft', value: 'DRAFT' },
]

describe('FilterControl', () => {
	it('picks and clears a select filter', async () => {
		const onChange = vi.fn()
		const { rerender, container } = render(
			<FilterControl
				filter={{ id: 'status', label: 'Status', type: 'select', options }}
				value={undefined}
				onChange={onChange}
			/>,
		)

		await userEvent.click(screen.getByRole('button', { name: 'Status' }))
		await userEvent.click(await screen.findByRole('option', { name: 'Draft' }))
		expect(onChange).toHaveBeenCalledWith('DRAFT')

		rerender(
			<FilterControl
				filter={{ id: 'status', label: 'Status', type: 'select', options }}
				value='DRAFT'
				onChange={onChange}
			/>,
		)
		expect(screen.getByRole('button', { name: 'Status' })).toHaveTextContent('Draft')

		const clear = container.querySelectorAll('svg')
		fireEvent.click(clear[clear.length - 1] as Element)
		expect(onChange).toHaveBeenLastCalledWith('')
	})

	it('searches a search select filter, picks a match, says when none match and clears', async () => {
		const onChange = vi.fn()
		const { rerender, container } = render(
			<FilterControl
				filter={{ id: 'status', label: 'Status', type: 'search-select', options }}
				value={undefined}
				onChange={onChange}
			/>,
		)
		const input = screen.getByRole('combobox', { name: 'Status' })

		await userEvent.type(input, 'pub')
		await userEvent.click(await screen.findByRole('option', { name: 'Published' }))
		expect(onChange).toHaveBeenCalledWith('PUBLISHED')

		await userEvent.clear(input)
		await userEvent.type(input, 'zzz')
		expect(await screen.findByText('No options found')).toBeInTheDocument()

		rerender(
			<FilterControl
				filter={{ id: 'status', label: 'Status', type: 'search-select', options }}
				value='PUBLISHED'
				onChange={onChange}
			/>,
		)
		const icons = container.querySelectorAll('svg')
		fireEvent.click(icons[icons.length - 1] as Element)
		expect(onChange).toHaveBeenLastCalledWith('')
	})
})
