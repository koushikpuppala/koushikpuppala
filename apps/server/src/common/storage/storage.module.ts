import { Module } from '@nestjs/common'
import { S3Service } from './s3.service'
import { STORAGE_SERVICE } from './storage.token'

@Module({
	providers: [S3Service, { provide: STORAGE_SERVICE, useExisting: S3Service }],
	exports: [S3Service, STORAGE_SERVICE],
})
export class StorageModule {}
