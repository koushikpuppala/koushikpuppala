export type ZodIssueLike = {
	path: PropertyKey[]
	message: string
}

export type ZodSchemaLike<T> = {
	safeParse: (
		data: unknown,
	) => { success: true; data: T } | { success: false; error: { issues: ZodIssueLike[] } }
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
