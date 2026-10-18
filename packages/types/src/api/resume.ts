export type ResumeDownload = { url: string; fileName: string }

// Shared with the admin's upload check; apps/server/src/modules/resume/resume.constants.spec.ts fails
// if the API's own limit drifts from this one.
export const RESUME_MAX_BYTES = 10 * 1024 * 1024
