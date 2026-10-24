import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Prisma } from '../generated/client'
import { MediaType, MetadataType } from '../generated/client'
import {
	about,
	DEFAULT_OG_IMAGE,
	educations,
	experiences,
	home,
	metadataPages,
	projects,
	published,
	services,
	SITE_DOMAIN,
	skills,
	socials,
} from './content'

type Tx = Prisma.TransactionClient

// The seed is idempotent: each record is matched on a natural key and updated or created, and
// published records that are no longer in content.ts are soft-deleted, so it can run repeatedly.
export const createSeed = (bucket: string, clientUrl: string) => {
	// Registers a file served from apps/client/public as a Media row, so seeded content can reference it.
	const upsertPublicFile = async (tx: Tx, path: string, type: MediaType, mimeType: string) => {
		const storageKey = `public/${path}`
		const fileName = path.split('/').pop() ?? path
		const data = {
			type,
			fileName,
			originalName: fileName,
			size: statSync(resolve(process.cwd(), '../../apps/client/public', path)).size,
			mimeType,
			extension: fileName.split('.').pop() ?? '',
			bucket,
			folder: 'public',
			url: `${clientUrl}/${path}`,
			altText: fileName,
		}

		return tx.media.upsert({ where: { storageKey }, create: { storageKey, ...data }, update: data })
	}

	// For content with a single live record (home, about): update the oldest one or create it.
	const upsertSingleton = async <T extends { id: string }>(
		find: () => Promise<T | null>,
		update: (id: string) => Promise<unknown>,
		create: () => Promise<unknown>,
	) => {
		const existing = await find()

		return existing ? update(existing.id) : create()
	}

	return async (tx: Tx) => {
		const prune = { deletedAt: new Date(), isPublished: false, publishedAt: null }

		console.log('  → Home')
		await upsertSingleton(
			() => tx.home.findFirst({ where: { deletedAt: null }, orderBy: { createdAt: 'asc' } }),
			id => tx.home.update({ where: { id }, data: { ...home, ...published() } }),
			() => tx.home.create({ data: { ...home, ...published() } }),
		)

		console.log('  → About')
		await upsertSingleton(
			() => tx.about.findFirst({ where: { deletedAt: null }, orderBy: { createdAt: 'asc' } }),
			id => tx.about.update({ where: { id }, data: { ...about, ...published() } }),
			() => tx.about.create({ data: { ...about, ...published() } }),
		)

		console.log('  → Experience')
		for (const exp of experiences) {
			const data = { ...exp, ...published() }
			const existing = await tx.experience.findFirst({
				where: { organization: exp.organization, title: exp.title, deletedAt: null },
			})
			await (existing
				? tx.experience.update({ where: { id: existing.id }, data })
				: tx.experience.create({ data }))
		}
		await tx.experience.updateMany({
			where: {
				deletedAt: null,
				NOT: { OR: experiences.map(({ organization, title }) => ({ organization, title })) },
			},
			data: prune,
		})

		console.log('  → Education')
		for (const edu of educations) {
			const data = { ...edu, ...published() }
			const existing = await tx.education.findFirst({
				where: { university: edu.university, degree: edu.degree, deletedAt: null },
			})
			await (existing
				? tx.education.update({ where: { id: existing.id }, data })
				: tx.education.create({ data }))
		}
		await tx.education.updateMany({
			where: {
				deletedAt: null,
				NOT: { OR: educations.map(({ university, degree }) => ({ university, degree })) },
			},
			data: prune,
		})

		console.log('  → Skills')
		for (const skill of skills) {
			const data = { ...skill, ...published() }
			const existing = await tx.skill.findFirst({
				where: { name: skill.name, category: skill.category, deletedAt: null },
			})
			await (existing
				? tx.skill.update({ where: { id: existing.id }, data })
				: tx.skill.create({ data }))
		}

		console.log('  → Services')
		for (const item of services) {
			const data = { ...item, ...published() }
			const existing = await tx.service.findFirst({ where: { title: item.title, deletedAt: null } })
			await (existing
				? tx.service.update({ where: { id: existing.id }, data })
				: tx.service.create({ data }))
		}
		await tx.service.updateMany({
			where: { deletedAt: null, title: { notIn: services.map(({ title }) => title) } },
			data: prune,
		})

		console.log('  → Projects')
		for (const { image, ...item } of projects) {
			const media = image ? await upsertPublicFile(tx, image, MediaType.IMAGE, 'image/webp') : null
			const data = {
				...item,
				thumbnailId: media?.id ?? null,
				heroImageId: media?.id ?? null,
				deletedAt: null,
				...published(),
			}
			await tx.project.upsert({ where: { slug: item.slug }, create: data, update: data })
		}
		await tx.project.updateMany({
			where: { deletedAt: null, slug: { notIn: projects.map(({ slug }) => slug) } },
			data: prune,
		})

		console.log('  → Socials')
		for (const social of socials) {
			const data = { ...social, isVisible: true, deletedAt: null }
			await tx.social.upsert({ where: { platform: social.platform }, create: data, update: data })
		}
		await tx.social.updateMany({
			where: { deletedAt: null, platform: { notIn: socials.map(({ platform }) => platform) } },
			data: { deletedAt: new Date(), isVisible: false },
		})

		console.log('  → SEO metadata')
		for (const page of metadataPages) {
			const data = {
				type: MetadataType.PAGE,
				title: page.title,
				description: page.description,
				canonicalUrl: `${SITE_DOMAIN}${page.path}`,
				ogImage: DEFAULT_OG_IMAGE,
				robots: 'index,follow',
				keywords: page.keywords,
				value: { title: page.title, description: page.description },
				...published(),
			}
			await tx.metadata.upsert({
				where: { key: page.key },
				create: { key: page.key, ...data },
				update: data,
			})
		}
	}
}
