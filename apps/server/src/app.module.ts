import type { MiddlewareConsumer, NestModule } from '@nestjs/common'

// Nest
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

// Third-party
import { SentryModule } from '@sentry/nestjs/setup'

// Infrastructure
import { RedisModule } from 'redis/redis.module'
import { ConfigModule } from 'config/config.module'
import { CommonModule } from 'common/common.module'
import { DatabaseModule } from 'database/database.module'
import { LoggerModule } from 'common/logger/logger.module'
import { StorageModule } from 'common/storage/storage.module'
import { RequestIdMiddleware } from 'common/middlewares/request-id.middleware'
import { RequestContextMiddleware } from 'common/middlewares/request-context.middleware'

// Core Features
import { AuthModule } from 'modules/auth/auth.module'
import { UserModule } from 'modules/user/user.module'
import { HealthModule } from 'modules/health/health.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'
import { ApiMetricModule } from 'modules/api-metric/api-metric.module'

// CMS & Portfolio Features
import { HomeModule } from 'modules/home/home.module'
import { AboutModule } from 'modules/about/about.module'
import { ExperienceModule } from 'modules/experience/experience.module'
import { EducationModule } from 'modules/education/education.module'
import { ProjectModule } from 'modules/project/project.module'
import { SkillModule } from 'modules/skill/skill.module'
import { ServiceModule } from 'modules/service/service.module'
import { ResumeModule } from 'modules/resume/resume.module'
import { SocialModule } from 'modules/social/social.module'
import { MediaModule } from 'modules/media/media.module'
import { ContactModule } from 'modules/contact/contact.module'
import { MetadataModule } from 'modules/metadata/metadata.module'

@Module({
	imports: [
		// Core Infrastructure
		AuthModule,
		UserModule,
		RedisModule,
		LoggerModule,
		ConfigModule,
		HealthModule,
		CommonModule,
		StorageModule,
		AuditLogModule,
		DatabaseModule,
		ApiMetricModule,

		// CMS & Portfolio Modules
		HomeModule,
		AboutModule,
		ExperienceModule,
		EducationModule,
		ProjectModule,
		SkillModule,
		ServiceModule,
		ResumeModule,
		SocialModule,
		MediaModule,
		ContactModule,
		MetadataModule,

		// Framework Providers
		SentryModule.forRoot(),
		ScheduleModule.forRoot(),
		EventEmitterModule.forRoot(),
		ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }]),
	],
	controllers: [],
	providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestIdMiddleware, RequestContextMiddleware).forRoutes('*')
	}
}
