export class AppFirebaseError extends Error {
	public readonly code: string
	public readonly status?: number

	constructor(code: string, message: string, status?: number) {
		super(message)
		this.code = code
		this.status = status
		this.name = 'FirebaseError'
	}
}
