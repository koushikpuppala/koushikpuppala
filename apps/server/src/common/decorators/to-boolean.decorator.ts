import { Transform } from 'class-transformer'

// Query strings arrive as text, and implicit conversion would turn 'false' into true.
export const ToBoolean = (): PropertyDecorator =>
	Transform(({ obj, key }) => {
		const raw: unknown = (obj as Record<string, unknown>)[key]

		if (raw === true || raw === 'true') return true
		if (raw === false || raw === 'false') return false

		return raw
	})
