import type { Type } from '@nestjs/common'
import type { DecodedIdToken } from 'firebase-admin/auth'
import type { AuditAction, AuditLog, MediaType } from '@repo/prisma'

export type RequestContextData = {
	userId?: string
	ipAddress?: string
	userAgent?: string
	requestId?: string
}

export type RequestMeta = {
	requestId: string
	endpoint: string
}

export type CodedError = {
	code?: string
	message?: string
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiEndpointOptions = {
	summary: string
	description?: string
	type?: Type<unknown>
	auth?: boolean
	endpoint?: string
	isArray?: boolean
	notFound?: boolean
	badRequest?: boolean
	forbidden?: boolean
	isPaginated?: boolean
	unauthorized?: boolean
	internalServerError?: boolean
	method: HttpMethod
}

export type OrderByList<F extends string> = Array<{ [K in F]?: 'asc' | 'desc' }>

export type DateRange = { from: Date; to: Date }

export type CreatedAtFilter = { gte?: Date; lte?: Date }

export type DateRangeQuery = {
	range?: 'today' | 'week' | 'month' | 'year'
	from?: string
	to?: string
}

export type SendEmailOptions = {
	from: string
	to: string
	subject: string
	text: string
	html: string
	replyTo?: string
}

export type EmailContent = Pick<SendEmailOptions, 'subject' | 'text' | 'html'>

export type ContactEmailData = {
	id: string
	name: string
	email: string
	subject: string
	message: string
	source: string | null
	ipAddress: string | null
	createdAt: Date
}

export type RecaptchaVerifyResponse = {
	success: boolean
	score?: number
	action?: string
	hostname?: string
	'error-codes'?: string[]
}

export type UploadFileOptions = {
	buffer: Buffer
	originalName: string
	contentType: string
	folder?: string
}

export type UploadFileResponse = {
	bucket: string
	key: string
	url: string
	size: number
}

export type StorageService = {
	upload(options: UploadFileOptions): Promise<UploadFileResponse>
	delete(key: string): Promise<void>
	exists(key: string): Promise<boolean>
	getSignedUrl(key: string, expiresIn?: number): Promise<string>
	getPresignedUploadUrl(
		Key: string,
		ContentType: string,
		ContentLength: number,
		expiresIn?: number,
	): Promise<string>
}

export type AllowedUpload = { extensions: string[]; type: MediaType }

export type AuditLogEntry = AuditLog & { actorEmail: string | null }

export type AuditLogParams = {
	action: AuditAction
	entity: string
	entityId: string
	oldData?: unknown
	newData?: unknown
	actorId?: string
	actorName?: string
	ipAddress?: string
	userAgent?: string
	requestId?: string
}

export type AuditLogCreateParams = AuditLogParams & { actor?: string }

export type RevalidateConfig = { url: string; secret?: string }
export type LoggerConfig = { dir: string; level: string }
export type SentryConfig = { enabled: boolean; dsn?: string }
export type RecaptchaConfig = { secretKey: string; minScore: number }
export type MailConfig = { from: string; contactTo: string; adminUrl: string }
export type AppConfig = { backendUrl: string }
export type AwsConfig = { region: string; s3Bucket: string; cdnUrl: string; verifyUploads: boolean }

export type PublishFields = { isPublished: boolean; publishedAt: Date | null }

export type Identifiable = { id: string }

export type Publishable = Identifiable & { isPublished: boolean }

export type DeletedRecord = { id: string; deleted: true }

export type LogFields = Record<string, unknown>

export type TimedOptions<T> = {
	result?: (value: T) => LogFields
	expected?: (error: unknown) => boolean
}

export type NameParts = { firstName: string; lastName: string }

export type MailService = {
	send(options: SendEmailOptions): Promise<void>
}

export type SessionContext = {
	token?: string
	decodedToken?: DecodedIdToken
	ip?: string
	userAgent?: string
}

export type UnwrappedBody = {
	result?: unknown
	message: string
	error?: boolean
	count?: number
}

export type DescribedError = {
	status: number
	rawMessage: unknown
	clientMessage: string
}
