export interface UploadFileOptions {
	buffer: Buffer
	originalName: string
	contentType: string
	folder?: string
}

export interface UploadFileResponse {
	bucket: string
	key: string
	url: string
	size: number
}

export interface StorageService {
	upload(options: UploadFileOptions): Promise<UploadFileResponse>
	delete(key: string): Promise<void>
	exists(key: string): Promise<boolean>
	getSignedUrl(key: string, expiresIn?: number): Promise<string>
	getPresignedUploadUrl(Key: string, ContentType: string, expiresIn?: number): Promise<string>
}
