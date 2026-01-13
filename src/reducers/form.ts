import type { FormReducer } from 'types/reducers'

import { useReducer } from 'react'
import type { FormError } from 'types/components'

export const useFormReducer = <T>(initialState: T) => {
	const reducer = <S>(state: S, action: FormReducer<S>): S => {
		switch (action.type) {
			case 'SET_FIELD':
				return { ...state, [action.field]: action.value }
			case 'SET_FIELDS':
				return { ...state, ...action.payload }
			case 'RESET':
				return action.payload
			default:
				return state
		}
	}

	const [form, dispatchForm] = useReducer(reducer<T>, initialState)
	const [error, dispatchError] = useReducer(reducer<FormError<T>>, {})

	const actions = {
		setField: <K extends keyof T>(field: K, value: T[K]) =>
			dispatchForm({ type: 'SET_FIELD', field, value }),
		setError: <K extends keyof T>(field: K, value: string) =>
			dispatchError({ type: 'SET_FIELD', field, value }),
		setFields: (payload: Partial<T>) => dispatchForm({ type: 'SET_FIELDS', payload }),
		setErrors: (payload: Partial<FormError<T>>) => dispatchError({ type: 'SET_FIELDS', payload }),
		resetForm: (payload?: T) => dispatchForm({ type: 'RESET', payload: payload ?? initialState }),
		resetError: (payload?: FormError<T>) =>
			dispatchError({ type: 'RESET', payload: payload ?? {} }),
	}

	return { form, error, ...actions }
}
