export const FIREBASE_AUTH_ERROR_MAP: Record<string, string> = {
	// Credentials
	'auth/invalid-email': 'Invalid email format.',
	'auth/user-not-found': 'Invalid credentials.',
	'auth/wrong-password': 'Invalid credentials.',
	'auth/invalid-credential': 'Invalid authentication credential.',
	'auth/user-disabled': 'This account has been disabled.',

	// Registration
	'auth/email-already-in-use': 'Email is already registered.',
	'auth/weak-password': 'Password must be at least 6 characters.',
	'auth/operation-not-allowed': 'This sign-in method is not enabled.',

	// Session / Token
	'auth/id-token-expired': 'Session expired. Please sign in again.',
	'auth/user-token-expired': 'Session expired. Please sign in again.',
	'auth/id-token-revoked': 'Session has been revoked.',
	'auth/requires-recent-login': 'Please reauthenticate and try again.',

	// Rate limiting
	'auth/too-many-requests': 'Too many attempts. Try again later.',

	// Network
	'auth/network-request-failed': 'Network error. Check your connection.',

	// Popup / OAuth
	'auth/popup-closed-by-user': 'Sign-in popup was closed.',
	'auth/cancelled-popup-request': 'Cancelled previous sign-in attempt.',
	'auth/account-exists-with-different-credential': 'Account exists with different sign-in method.',

	// Phone
	'auth/invalid-verification-code': 'Invalid verification code.',
	'auth/invalid-verification-id': 'Invalid verification session.',
}

export const FIRESTORE_ERROR_MAP: Record<string, string> = {
	'permission-denied': 'You do not have permission to perform this action.',
	'not-found': 'Requested resource not found.',
	'already-exists': 'Resource already exists.',
	'resource-exhausted': 'Quota exceeded. Try again later.',
	'failed-precondition': 'Operation failed due to server condition.',
	aborted: 'Operation aborted. Please retry.',
	'out-of-range': 'Invalid data range.',
	unimplemented: 'Feature not supported.',
	internal: 'Internal server error.',
	unavailable: 'Service temporarily unavailable.',
	'deadline-exceeded': 'Request timed out.',
	'data-loss': 'Data corruption detected.',
	unauthenticated: 'Authentication required.',
}
