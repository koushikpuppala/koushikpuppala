import type { FormError } from 'types/components'

export type FormReducer<T> =
	| { type: 'SET_FIELD'; field: keyof T; value: T[keyof T] }
	| { type: 'SET_FIELDS'; payload: Partial<T> }
	| { type: 'RESET'; payload: T }

export type ErrorReducer<T> =
	| { type: 'SET_ERROR'; field: keyof T; message: string }
	| { type: 'SET_ERRORS'; payload: FormError<T> }
	| { type: 'CLEAR_ERRORS' }
