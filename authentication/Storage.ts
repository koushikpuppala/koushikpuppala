import {
	getStorage,
	deleteObject,
	ref,
	getDownloadURL,
	uploadBytes,
	FirebaseStorage,
	StorageReference,
	UploadResult,
} from 'firebase/storage'
import { StorageType } from 'types/authentication'
import { initializeApp } from 'firebase/app'
import { config } from 'config'

const storage: FirebaseStorage = getStorage(initializeApp(config.firebaseConfig))

export const Storage: StorageType = {
	upload: async (url: string, data: Blob | ArrayBuffer | Uint8Array): Promise<string> => {
		const storageRef: StorageReference = ref(storage, url)
		const snapshot: UploadResult = await uploadBytes(storageRef, data)
		return await getDownloadURL(snapshot.ref)
	},
	download: async (url: string): Promise<string> => {
		const storageRef: StorageReference = ref(storage, url)
		return await getDownloadURL(storageRef)
	},
	delete: async (url: string): Promise<void> => {
		const storageRef: StorageReference = ref(storage, url)
		return await deleteObject(storageRef)
	},
}
