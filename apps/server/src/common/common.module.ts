import { Module } from '@nestjs/common'
import { UserService } from 'modules/user'
import { RolesGuard } from './guards/roles.guard'
import { Configuration } from 'config/configuration'
import { ApiMetricModule } from 'modules/api-metric'
import { FirebaseService } from 'firebase/firebase.service'
import { FirebaseAuthGuard } from './guards/firebase-auth.guard'
import { LoggerInterceptor } from './interceptors/logger.interceptor'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { GlobalExceptionFilter } from './filters/global-exception.filter'

@Module({
	imports: [ApiMetricModule],
	providers: [
		UserService,
		Configuration,
		FirebaseService,
		{ provide: APP_GUARD, useClass: FirebaseAuthGuard },
		{ provide: APP_GUARD, useClass: RolesGuard },
		{ provide: APP_FILTER, useClass: GlobalExceptionFilter },
		{ provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
	],
})
export class CommonModule {}
