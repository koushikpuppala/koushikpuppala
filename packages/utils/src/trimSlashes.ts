// Splitting instead of a trim regex keeps this linear on long runs of slashes.
export const trimSlashes = (path: string): string => path.split('/').filter(Boolean).join('/')
