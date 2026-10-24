import { Module } from '@nestjs/common'
import { SesService } from './ses.service'
import { MAIL_SERVICE } from './mail.token'

@Module({
	providers: [SesService, { provide: MAIL_SERVICE, useExisting: SesService }],
	exports: [SesService, MAIL_SERVICE],
})
export class MailModule {}
