import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { SentryModule } from '@sentry/nestjs/setup'

import { RedisModule } from 'redis/redis.module'
import { ConfigModule } from 'config/config.module'
import { CommonModule } from 'common/common.module'
import { DatabaseModule } from 'database/database.module'
import { FirebaseModule } from 'firebase/firebase.module'
import { LoggerModule } from 'common/logger/logger.module'
import { StorageModule } from 'common/storage/storage.module'

import { AuthModule } from 'modules/auth/auth.module'
import { UserModule } from 'modules/user/user.module'
import { HealthModule } from 'modules/health/health.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'
import { ApiMetricModule } from 'modules/api-metric/api-metric.module'

import { HomeModule } from 'modules/home/home.module'
import { AboutModule } from 'modules/about/about.module'
import { SkillModule } from 'modules/skill/skill.module'
import { MediaModule } from 'modules/media/media.module'
import { ResumeModule } from 'modules/resume/resume.module'
import { SocialModule } from 'modules/social/social.module'
import { ProjectModule } from 'modules/project/project.module'
import { ServiceModule } from 'modules/service/service.module'
import { ContactModule } from 'modules/contact/contact.module'
import { MetadataModule } from 'modules/metadata/metadata.module'
import { EducationModule } from 'modules/education/education.module'
import { ExperienceModule } from 'modules/experience/experience.module'

@Module({
	imports: [
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
		FirebaseModule,
		ApiMetricModule,

		HomeModule,
		AboutModule,
		SkillModule,
		MediaModule,
		SocialModule,
		ResumeModule,
		ProjectModule,
		ServiceModule,
		ContactModule,
		MetadataModule,
		EducationModule,
		ExperienceModule,

		SentryModule.forRoot(),
		ScheduleModule.forRoot(),
		EventEmitterModule.forRoot(),
		// A generous global ceiling per client; sensitive public routes such as the contact form set their own.
		ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }]),
	],
	controllers: [],
	providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
