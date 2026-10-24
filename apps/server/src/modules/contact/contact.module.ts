import { Module } from '@nestjs/common'
import { ContactService } from './contact.service'
import { ContactNotifier } from './contact.notifier'
import { MailModule } from 'common/mail/mail.module'
import { RecaptchaService } from './recaptcha.service'
import { ContactController } from './contact.controller'
import { DatabaseModule } from 'database/database.module'
import { AuditLogModule } from 'modules/audit-log/audit-log.module'

@Module({
	imports: [DatabaseModule, AuditLogModule, MailModule],
	controllers: [ContactController],
	providers: [ContactService, ContactNotifier, RecaptchaService],
	exports: [ContactService],
})
export class ContactModule {}
