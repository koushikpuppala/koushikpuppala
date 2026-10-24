// @vitest-environment node
import { getHomeData } from 'lib/home-data'
import { http, HttpResponse } from 'msw'
import { API, server } from '../../test/msw'
import { describe, expect, it } from 'vitest'
import { EMPTY_HOME } from 'constants/empty-content'

describe('home data', () => {
	it('uses the published home content', async () => {
		server.use(
			http.get(`${API}/api/v1/home/published`, () =>
				HttpResponse.json({
					result: { title: 'Hi', subtitles: ['Engineer'], profileImage: { url: 'u' } },
				}),
			),
		)

		await expect(getHomeData()).resolves.toMatchObject({
			title: 'Hi',
			subtitles: ['Engineer'],
			profileImageUrl: 'u',
			featuredSkills: [],
		})
	})

	it('falls back to empty values when the API fails', async () => {
		server.use(
			http.get(`${API}/api/v1/home/published`, () => HttpResponse.json({}, { status: 500 })),
		)

		await expect(getHomeData()).resolves.toEqual(EMPTY_HOME)
	})
})
