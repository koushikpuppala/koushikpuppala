import { Module } from '@nestjs/common'
import { S3Service } from './s3.service'

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE')

@Module({
	providers: [S3Service, { provide: STORAGE_SERVICE, useExisting: S3Service }],
	exports: [S3Service, STORAGE_SERVICE],
})
export class StorageModule {}
