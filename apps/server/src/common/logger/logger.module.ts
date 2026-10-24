import { Global, Module } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { ConfigModule } from 'config/config.module'

@Global()
@Module({
	imports: [ConfigModule],
	providers: [LoggerService],
	exports: [LoggerService],
})
export class LoggerModule {}
