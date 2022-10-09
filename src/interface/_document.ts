import { DocumentProps } from 'next/document'

export default interface Document extends DocumentProps {
	emotionStyleTags: JSX.Element[]
}
