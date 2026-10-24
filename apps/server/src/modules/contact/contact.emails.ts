import type { ContactEmailData, EmailContent } from 'types/server'

const HTML_ENTITIES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
}

const escapeHtml = (value: string): string =>
	value.replace(/[&<>"']/g, character => HTML_ENTITIES[character] ?? character)

const layout = (body: string): string =>
	`<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px">${body}</div>`

export const contactNotificationEmail = (
	contact: ContactEmailData,
	adminUrl: string,
): EmailContent => {
	const link = `${adminUrl}/messages?id=${contact.id}`

	const details: [string, string][] = [
		['Name', contact.name],
		['Email', contact.email],
		['Subject', contact.subject],
		['Source', contact.source ?? 'unknown'],
		['IP address', contact.ipAddress ?? 'unknown'],
		['Received', contact.createdAt.toUTCString()],
	]

	const rows = details
		.map(
			([label, value]) =>
				`<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
		)
		.join('')

	return {
		subject: `New contact message: ${contact.subject}`,
		text: [
			`${contact.name} sent a message through the contact form.`,
			'',
			...details.map(([label, value]) => `${label}: ${value}`),
			'',
			'Message:',
			contact.message,
			'',
			`Open it in the admin: ${link}`,
		].join('\n'),
		html: layout(
			`<p>${escapeHtml(contact.name)} sent a message through the contact form.</p>` +
				`<table style="border-collapse:collapse;font-size:15px">${rows}</table>` +
				`<p style="margin:20px 0 4px;color:#666">Message</p>` +
				`<div style="white-space:pre-wrap;padding:12px 16px;background:#f5f5f5;border-radius:6px">${escapeHtml(contact.message)}</div>` +
				`<p style="margin-top:24px"><a href="${escapeHtml(link)}" style="display:inline-block;padding:10px 18px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:6px">Open in admin</a></p>`,
		),
	}
}

export const contactAcknowledgementEmail = (
	contact: Pick<ContactEmailData, 'name'>,
): EmailContent => ({
	subject: 'Thanks for reaching out',
	text: [
		`Hi ${contact.name},`,
		'',
		'Thanks for getting in touch. I have received your message and will reply soon.',
		'',
		'Koushik Puppala',
	].join('\n'),
	html: layout(
		`<p>Hi ${escapeHtml(contact.name)},</p>` +
			`<p>Thanks for getting in touch. I have received your message and will reply soon.</p>` +
			`<p>Koushik Puppala</p>`,
	),
})
