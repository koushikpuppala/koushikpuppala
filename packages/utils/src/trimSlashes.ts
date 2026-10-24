// Splitting instead of a /^\/+|\/+$/ regex keeps this linear on long runs of slashes, which matters
// for paths that come from a URL. Repeated slashes inside the path collapse to one.
export const trimSlashes = (path: string): string => path.split('/').filter(Boolean).join('/')
