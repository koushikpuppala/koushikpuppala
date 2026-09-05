// Generate a single UUID
export const randomUUID = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

// Generate an array of UUIDs
export const randomUUIDArray = (length: number): string[] =>
	Array.from({ length }, () => randomUUID())

// Random boolean (true/false)
export const randomBool = (): boolean => Math.random() < 0.5

// Random float in range [min, max)
export const randomNumber = (min: number, max: number): number => Math.random() * (max - min) + min

// Array of random floats in range [min, max)
export const randomNumberArray = (length: number, min: number, max: number): number[] =>
	Array.from({ length }, () => randomNumber(min, max))

// Random integer in range [min, max] (inclusive)
export const randomInt = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min

// Pick a random item from a non-empty array
export const randomChoice = <T>(arr: T[]): T => {
	if (arr.length === 0) throw new Error('Cannot choose from an empty array')

	const item = arr[randomInt(0, arr.length - 1)]

	if (item === undefined) throw new Error('Invalid random index')

	return item
}

// Pick a random item from an array, but throw if index is out of bounds
export function at<T>(arr: T[], index: number): T {
	const value = arr[index]

	if (value === undefined) throw new Error(`Index ${index} out of bounds`)

	return value
}

// Pick multiple random items (with replacement)
export const randomChoiceArray = <T>(arr: T[], length: number): T[] =>
	Array.from({ length }, () => randomChoice(arr))

// Shuffle an array (Fisher–Yates algorithm)
export const shuffleArray = <T>(arr: T[]): T[] => {
	const copy = [...arr]
	for (let i = copy.length - 1; i > 0; i--) {
		const j = randomInt(0, i)

		const temp = at(copy, i)
		copy[i] = at(copy, j)
		copy[j] = temp
	}
	return copy
}

// Generate a random alphanumeric string
export const randomString = (length: number): string =>
	Array.from({ length }, () => Math.random().toString(36)[2]).join('')

// Generate a random hexadecimal string
export const randomHex = (length: number): string =>
	Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('')

// Generate a random date between two dates
export const randomDate = (start: Date, end: Date): Date =>
	new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

// Generate a random color in HEX format
export const randomColor = (): string =>
	`#${Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padStart(6, '0')}`

// Generate a random item with weight probabilities
export const weightedChoice = <T>(items: { value: T; weight: number }[]): T => {
	const total = items.reduce((sum, item) => sum + item.weight, 0)
	let r = Math.random() * total
	for (const item of items) {
		if (r < item.weight) return item.value
		r -= item.weight
	}

	const lastItem = items[items.length - 1]

	if (lastItem === undefined) throw new Error('No items provided for weighted choice')

	return lastItem.value // fallback
}
