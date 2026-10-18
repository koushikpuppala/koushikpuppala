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
		// Every route is authenticated by default; @Public() opts out. Guards run in this order,
		// so RolesGuard always sees the database user that FirebaseAuthGuard attached.
		{ provide: APP_GUARD, useClass: FirebaseAuthGuard },
		{ provide: APP_GUARD, useClass: RolesGuard },
		{ provide: APP_FILTER, useClass: GlobalExceptionFilter },
		{ provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: RevalidateInterceptor },
	],
})
export class CommonModule {}
