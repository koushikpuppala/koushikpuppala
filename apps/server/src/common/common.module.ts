import { Module } from '@nestjs/common'
import { UserModule } from 'modules/user'
import { RolesGuard } from './guards/roles.guard'
import { ApiMetricModule } from 'modules/api-metric'
import { AuthModule } from 'modules/auth/auth.module'
import { FirebaseAuthGuard } from './guards/firebase-auth.guard'
import { LoggerInterceptor } from './interceptors/logger.interceptor'
import { RevalidateInterceptor } from './interceptors/revalidate.interceptor'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { GlobalExceptionFilter } from './filters/global-exception.filter'

@Module({
	imports: [ApiMetricModule, UserModule, AuthModule],
	providers: [
		// Guards run in this order: RolesGuard reads the user that FirebaseAuthGuard attaches.
		{ provide: APP_GUARD, useClass: FirebaseAuthGuard },
		{ provide: APP_GUARD, useClass: RolesGuard },
		{ provide: APP_FILTER, useClass: GlobalExceptionFilter },
		{ provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: RevalidateInterceptor },
	],
})
export class CommonModule {}
