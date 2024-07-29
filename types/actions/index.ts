export type prevStateType = { statusCode: number; statusMessage: string }

export type handleFormSubmitType = (prevState: prevStateType, form: FormData) => Promise<prevStateType>
