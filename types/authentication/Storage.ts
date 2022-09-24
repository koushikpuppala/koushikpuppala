export type Storage = {
	upload: (url: string, data: Blob | ArrayBuffer | Uint8Array) => Promise<string>
	download: (url: string) => Promise<string>
	delete: (url: string) => Promise<void>
}
