import { extname } from 'node:path'
import { randomUUID } from 'node:crypto'

import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable, NotFoundException } from '@nestjs/common'

import { Configuration } from 'config/configuration'

import type { StorageService, UploadFileOptions, UploadFileResponse } from './storage.interface'

@Injectable()
export class S3Service implements StorageService {
	private readonly s3: S3Client

	constructor(private readonly config: Configuration) {
		this.s3 = new S3Client({ region: config.aws.region })
	}

	async upload(options: UploadFileOptions): Promise<UploadFileResponse> {
		const extension = extname(options.originalName)

		const folder = options.folder?.replace(/^\/|\/$/g, '')

		const fileName = `${randomUUID()}${extension}`

		const key = folder ? `${folder}/${fileName}` : fileName

		await this.s3.send(
			new PutObjectCommand({
				Key: key,
				Body: options.buffer,
				Bucket: this.config.aws.s3Bucket,
				ContentType: options.contentType,
			}),
		)

		return {
			key,
			size: options.buffer.length,
			bucket: this.config.aws.s3Bucket,
			url: `https://${this.config.aws.cdnUrl}/${key}`,
		}
	}

	async delete(key: string): Promise<void> {
		await this.s3.send(new DeleteObjectCommand({ Bucket: this.config.aws.s3Bucket, Key: key }))
	}

	async exists(key: string): Promise<boolean> {
		try {
			await this.s3.send(new HeadObjectCommand({ Key: key, Bucket: this.config.aws.s3Bucket }))

			return true
		} catch {
			return false
		}
	}

	async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
		const exists = await this.exists(key)

		if (!exists) throw new NotFoundException('File not found')

		return getSignedUrl(
			this.s3,
			new GetObjectCommand({ Bucket: this.config.aws.s3Bucket, Key: key }),
			{ expiresIn },
		)
	}

	async getPresignedUploadUrl(Key: string, ContentType: string, expiresIn = 900): Promise<string> {
		const Bucket = this.config.aws.s3Bucket

		return getSignedUrl(this.s3, new PutObjectCommand({ Key, ContentType, Bucket }), { expiresIn })
	}
}
