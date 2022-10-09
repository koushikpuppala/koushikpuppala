import { AppProps } from 'next/app'
import { EmotionCache } from '@emotion/react'

export default interface App extends AppProps {
	emotionCache?: EmotionCache
}
