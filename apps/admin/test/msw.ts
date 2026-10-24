import { setupServer } from 'msw/node'

export const API = 'http://api.test'

export const server = setupServer()
