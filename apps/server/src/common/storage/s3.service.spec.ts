import type { Configuration } from 'config/configuration'

import { NotFoundException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { S3Service } from './s3.service'

const signed = vi.hoisted(() => vi.fn(async () => 'https://signed.example.com/object'))
vi.mock('@aws-sdk/s3-request-presigner', () => ({ getSignedUrl: signed }))

const config = {
	aws: { region: 'ap-south-2', s3Bucket: 'bucket', cdnUrl: 'https://cdn.example.com' },
} as unknown as Configuration

describe('S3Service', () => {
	let send: ReturnType<typeof vi.spyOn>
	let service: S3Service

	beforeEach(() => {
		signed.mockClear()
		send = vi.spyOn(S3Client.prototype, 'send').mockResolvedValue({} as never)
		service = new S3Service(config)
	})

	const sentCommand = (index = 0) => send.mock.calls[index]?.[0] as { input: Record<string, unknown> }

	it('uploads into a folder under a time ordered name and returns its CDN URL', async () => {
		const buffer = Buffer.from('hello')

		const result = await service.upload({
			buffer,
			originalName: 'Photo.PNG',
			contentType: 'image/png',
			folder: '/avatars/',
		})

		expect(sentCommand()).toBeInstanceOf(PutObjectCommand)
		expect(sentCommand().input).toMatchObject({ Bucket: 'bucket', ContentType: 'image/png', Body: buffer })
		expect(result.key).toMatch(/^avatars\/[0-9a-f-]{36}\.PNG$/)
		expect(result).toMatchObject({ size: 5, bucket: 'bucket', url: `https://cdn.example.com/${result.key}` })
	})

	it('uploads to the bucket root without a folder', async () => {
		const result = await service.upload({ buffer: Buffer.from('x'), originalName: 'a.pdf', contentType: 'application/pdf' })

		expect(result.key).toMatch(/^[0-9a-f-]{36}\.pdf$/)
	})

	it('deletes an object', async () => {
		await service.delete('general/a.png')

		expect(sentCommand()).toBeInstanceOf(DeleteObjectCommand)
		expect(sentCommand().input).toEqual({ Bucket: 'bucket', Key: 'general/a.png' })
	})

	it('reports whether an object exists', async () => {
		expect(await service.exists('general/a.png')).toBe(true)
		expect(sentCommand()).toBeInstanceOf(HeadObjectCommand)

		send.mockRejectedValueOnce(new Error('NotFound'))
		expect(await service.exists('general/missing.png')).toBe(false)
	})

	it('signs a download that saves under the given file name', async () => {
		const url = await service.getSignedUrl('resume/cv.pdf', 60, { fileName: 'ada.pdf', contentType: 'application/pdf' })

		expect(url).toBe('https://signed.example.com/object')
		const [, command, options] = signed.mock.calls[0] as unknown as [unknown, GetObjectCommand, { expiresIn: number }]
		expect(command).toBeInstanceOf(GetObjectCommand)
		expect(command.input).toMatchObject({
			Key: 'resume/cv.pdf',
			ResponseContentDisposition: 'attachment; filename="ada.pdf"',
			ResponseContentType: 'application/pdf',
		})
		expect(options).toEqual({ expiresIn: 60 })
	})

	it('signs a plain read link with the default lifetime', async () => {
		await service.getSignedUrl('general/a.png')

		const [, command, options] = signed.mock.calls[0] as unknown as [unknown, GetObjectCommand, { expiresIn: number }]
		expect(command.input).not.toHaveProperty('ResponseContentDisposition')
		expect(options).toEqual({ expiresIn: 3600 })
	})

	it('refuses to sign a link for a missing object', async () => {
		send.mockRejectedValueOnce(new Error('NotFound'))

		await expect(service.getSignedUrl('general/missing.png')).rejects.toThrow(NotFoundException)
		expect(signed).not.toHaveBeenCalled()
	})

	it('signs an upload bound to its content type and size', async () => {
		await service.getPresignedUploadUrl('general/b.png', 'image/png', 2048)

		const [, command, options] = signed.mock.calls[0] as unknown as [
			unknown,
			PutObjectCommand,
			{ expiresIn: number; signableHeaders: Set<string> },
		]
		expect(command.input).toEqual({ Key: 'general/b.png', ContentType: 'image/png', ContentLength: 2048, Bucket: 'bucket' })
		expect(options.expiresIn).toBe(900)
		expect([...options.signableHeaders]).toEqual(['content-type', 'content-length'])
	})
})
