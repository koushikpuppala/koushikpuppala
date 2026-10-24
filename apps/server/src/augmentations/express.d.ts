import 'multer'
import 'express-serve-static-core'

import type { DecodedIdToken } from 'firebase-admin/auth'
import type { AuthenticatedUser, RequestContext } from 'types/auth'

declare global {
	namespace Express {
		interface Request {
			token?: string
			requestId: string
			startTime: number
			context: RequestContext
			user?: AuthenticatedUser
			decodedToken?: DecodedIdToken
		}
	}
}
