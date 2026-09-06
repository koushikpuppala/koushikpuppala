import { useCallback, useReducer, useState } from 'react'

export type ZodIssueLike = {
	path: PropertyKey[]
	message: string
}

export type ZodSchemaLike<T> = {
	safeParse: (data: unknown) =>
		| { success: true; data: T }
		| { success: false; error: { issues: ZodIssueLike[] } }
}

export type FormState<T> = {
	values: T
	errors: Partial<Record<keyof T, string>>
	touched: Partial<Record<keyof T, boolean>>
	isSubmitting: boolean
}

export type FormAction<T> =
	| { type: 'SET_FIELD'; field: keyof T; value: unknown }
	| { type: 'SET_ERROR'; field: keyof T; error: string | undefined }
	| { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, string>> }
	| { type: 'SET_TOUCHED'; field: keyof T; touched: boolean }
	| { type: 'SET_SUBMITTING'; isSubmitting: boolean }
	| { type: 'RESET'; initialValues: T }

export type UseFormOptions<T> = {
	initialValues: T
	schema?: ZodSchemaLike<T>
	onSubmit: (values: T) => Promise<void> | void
}

export const useFormReducer = <T extends Record<string, any>>({
	initialValues,
	schema,
	onSubmit,
}: UseFormOptions<T>) => {
	const formReducer = (state: FormState<T>, action: FormAction<T>): FormState<T> => {
		switch (action.type) {
			case 'SET_FIELD':
				return {
					...state,
					values: { ...state.values, [action.field]: action.value },
				}
			case 'SET_ERROR':
				return {
					...state,
					errors: { ...state.errors, [action.field]: action.error },
				}
			case 'SET_ERRORS':
				return { ...state, errors: action.errors }
			case 'SET_TOUCHED':
				return {
					...state,
					touched: { ...state.touched, [action.field]: action.touched },
				}
			case 'SET_SUBMITTING':
				return { ...state, isSubmitting: action.isSubmitting }
			case 'RESET':
				return {
					values: action.initialValues,
					errors: {},
					touched: {},
					isSubmitting: false,
				}
			default:
				return state
		}
	}

	const [state, dispatch] = useReducer(formReducer, {
		values: initialValues,
		errors: {},
		touched: {},
		isSubmitting: false,
	})

	const [submitError, setSubmitError] = useState<string | null>(null)

	const validate = useCallback(
		(valuesToValidate: T): boolean => {
			if (!schema) return true
			const result = schema.safeParse(valuesToValidate)
			if (result.success) {
				dispatch({ type: 'SET_ERRORS', errors: {} })
				return true
			}
			const formattedErrors: Partial<Record<keyof T, string>> = {}
			for (const issue of result.error.issues) {
				const field = issue.path[0] as keyof T
				if (field && !formattedErrors[field]) {
					formattedErrors[field] = issue.message
				}
			}
			dispatch({ type: 'SET_ERRORS', errors: formattedErrors })
			return false
		},
		[schema],
	)

	const handleChange = useCallback(
		(field: keyof T, value: unknown) => {
			dispatch({ type: 'SET_FIELD', field, value })
			if (schema && state.touched[field]) {
				const updatedValues = { ...state.values, [field]: value }
				const result = schema.safeParse(updatedValues)
				if (!result.success) {
					const issue = result.error.issues.find((i: ZodIssueLike) => i.path[0] === field)
					dispatch({ type: 'SET_ERROR', field, error: issue ? issue.message : undefined })
				} else {
					dispatch({ type: 'SET_ERROR', field, error: undefined })
				}
			}
		},
		[schema, state.touched, state.values],
	)

	const handleBlur = useCallback(
		(field: keyof T) => {
			dispatch({ type: 'SET_TOUCHED', field, touched: true })
			if (schema) {
				const result = schema.safeParse(state.values)
				if (!result.success) {
					const issue = result.error.issues.find((i: ZodIssueLike) => i.path[0] === field)
					dispatch({ type: 'SET_ERROR', field, error: issue ? issue.message : undefined })
				}
			}
		},
		[schema, state.values],
	)

	const handleSubmit = useCallback(
		async (e?: React.FormEvent) => {
			if (e) e.preventDefault()
			setSubmitError(null)

			const isValid = validate(state.values)
			if (!isValid) return

			dispatch({ type: 'SET_SUBMITTING', isSubmitting: true })
			try {
				await onSubmit(state.values)
			} catch (err: unknown) {
				setSubmitError(err instanceof Error ? err.message : 'An error occurred during submission.')
			} finally {
				dispatch({ type: 'SET_SUBMITTING', isSubmitting: false })
			}
		},
		[onSubmit, state.values, validate],
	)

	const reset = useCallback(() => {
		dispatch({ type: 'RESET', initialValues })
		setSubmitError(null)
	}, [initialValues])

	return {
		values: state.values,
		errors: state.errors,
		touched: state.touched,
		isSubmitting: state.isSubmitting,
		submitError,
		handleChange,
		handleBlur,
		handleSubmit,
		reset,
		setValues: (values: T) => dispatch({ type: 'RESET', initialValues: values }),
	}
}
