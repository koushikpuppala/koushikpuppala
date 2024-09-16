import { NextRequest } from 'next/server'

import { revalidateTag } from 'next/cache'
import { SANITY_DOCUMENT_TYPE } from '@import/constant'

export const POST = async (req: NextRequest) => {
	const { tag } = await req.json()

	switch (tag) {
		case SANITY_DOCUMENT_TYPE.ABOUT:
			revalidateTag(SANITY_DOCUMENT_TYPE.ABOUT)
			revalidateTag(SANITY_DOCUMENT_TYPE.RESUME)
			break
		case SANITY_DOCUMENT_TYPE.EXPERIENCE:
			revalidateTag(SANITY_DOCUMENT_TYPE.EXPERIENCE)
			break
		case SANITY_DOCUMENT_TYPE.HOME:
			revalidateTag(SANITY_DOCUMENT_TYPE.HOME)
			break
		case SANITY_DOCUMENT_TYPE.PROJECT:
			revalidateTag(SANITY_DOCUMENT_TYPE.PROJECT)
			break
		default:
			return Response.json({ success: false, message: 'Invalid tag.' }, { status: 400 })
	}

	return Response.json({ success: true, message: `Revalidation triggered for ${tag} documents.` }, { status: 200 })
}
