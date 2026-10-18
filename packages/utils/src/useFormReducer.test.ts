import type { ZodSchemaLike } from 'types/utils'

import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useFormReducer } from './useFormReducer'

type Values = { email: string }

const schema: ZodSchemaLike<Values> = {
	safeParse: input => {
		const values = input as Values
		return values.email.includes('@')
			? { success: true, data: values }
			: { success: false, error: { issues: [{ path: ['email'], message: 'Invalid email' }] } }
	},
}

const setup = (onSubmit = vi.fn()) =>
	renderHook(() => useFormReducer<Values>({ initialValues: { email: '' }, schema, onSubmit }))

describe('useFormReducer', () => {
	it('blocks submit and reports field errors when validation fails', async () => {
		const onSubmit = vi.fn()
		const { result } = setup(onSubmit)

		await act(() => result.current.handleSubmit())

		expect(onSubmit).not.toHaveBeenCalled()
		expect(result.current.errors.email).toBe('Invalid email')
	})

	it('submits valid values', async () => {
		const onSubmit = vi.fn()
		const { result } = setup(onSubmit)

		act(() => result.current.handleChange('email', 'a@b.co'))
		await act(() => result.current.handleSubmit())

		expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.co' })
		expect(result.current.submitError).toBeNull()
		expect(result.current.isSubmitting).toBe(false)
	})

	it('surfaces a thrown submit error as submitError', async () => {
		const { result } = setup(vi.fn().mockRejectedValue(new Error('Email already exists')))

		act(() => result.current.handleChange('email', 'a@b.co'))
		await act(() => result.current.handleSubmit())

		expect(result.current.submitError).toBe('Email already exists')
		expect(result.current.isSubmitting).toBe(false)
	})

	it('validates a touched field as the user types', () => {
		const { result } = setup()

		act(() => result.current.handleBlur('email'))
		act(() => result.current.handleChange('email', 'nope'))
		expect(result.current.errors.email).toBe('Invalid email')

		act(() => result.current.handleChange('email', 'ok@x.io'))
		expect(result.current.errors.email).toBeUndefined()
	})

	it('reset restores initial values and clears errors', async () => {
		const { result } = setup(vi.fn().mockRejectedValue(new Error('boom')))

		act(() => result.current.handleChange('email', 'a@b.co'))
		await act(() => result.current.handleSubmit())
		act(() => result.current.reset())

		expect(result.current.values).toEqual({ email: '' })
		expect(result.current.submitError).toBeNull()
	})
})
