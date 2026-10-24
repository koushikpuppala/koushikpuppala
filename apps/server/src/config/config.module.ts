import { Global, Module } from '@nestjs/common'
import { Configuration } from './configuration'

@Global()
@Module({
	providers: [Configuration],
	exports: [Configuration],
})
export class ConfigModule {}
