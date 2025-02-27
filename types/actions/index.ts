export type prevStateType = { statusCode: number; statusMessage: string }

export type handleFormSubmitType = (
	prevState: prevStateType,
	form: FormData,
) => Promise<prevStateType>

export type ServerActionResponse<T> = {
	error: boolean
	code: number
	message: string
	result: T | undefined
}
