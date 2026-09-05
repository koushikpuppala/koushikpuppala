import { Module } from '@nestjs/common'
import { Configuration } from './configuration'

@Module({
	providers: [Configuration],
	exports: [Configuration],
})
export class ConfigModule {}
