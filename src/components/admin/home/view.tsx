'use client'

import type { Home } from 'prisma'
import type { ColumnDef } from '@tanstack/react-table'

import { DataTable } from 'components/ui'
import { getAllHome } from 'actions/cache'
import { formatDate } from 'utils/formatDate'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'

export const AdminHomeViewComponent = () => {
	const searchParams = useSearchParams()

	const filter = useMemo(
		() => ({
			page: Number(searchParams.get('page') || 1),
			count: Number(searchParams.get('count') || 10),
			nonPaginated: searchParams.get('nonPaginated') === 'true' || false,
		}),
		[searchParams]
	)

	const [isLoading, startLoadingTransition] = useTransition()

	const [data, setData] = useState<Home[]>([])
	const [totalCount, setTotalCount] = useState<number>(0)

	useEffect(() => {
		startLoadingTransition(async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 5000)) // Simulate loading delay

				const { error, message, result, totalCount } = await getAllHome(filter)

				if (error) throw new Error(message)

				setData(result || [])
				setTotalCount(totalCount || 0)
			} catch (error) {
				console.error(error)
				setData([])
				setTotalCount(0)
			}
		})
	}, [filter])

	const columns = useMemo<ColumnDef<Home>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Title',
				cell({ row: { original } }) {
					return <span className='capitalize'>{original.title}</span>
				},
			},
			{
				accessorKey: 'subtitle',
				header: 'Subtitles',
				cell({ row: { original } }) {
					return <span className='line-clamp-1 capitalize'>{original.subtitles.join(', ')}</span>
				},
			},
			{
				accessorKey: 'isPublished',
				header: 'Published',
				cell({ row: { original } }) {
					return <span className='capitalize'>{original.isPublished ? 'Yes' : 'No'}</span>
				},
			},
			{
				accessorKey: 'publishedAt',
				header: 'Published At',
				cell({ row: { original } }) {
					return (
						<span className='capitalize'>
							{original.publishedAt ? formatDate(original.publishedAt) : 'Unpublished'}
						</span>
					)
				},
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				cell({ row: { original } }) {
					return (
						<div className='flex items-center gap-2'>
							<button
								type='button'
								onClick={() => {
									// Handle edit action
								}}
								className='text-blue-500 hover:underline'>
								Edit
							</button>
						</div>
					)
				},
			},
		],
		[]
	)

	return (
		<DataTable
			data={data}
			columns={columns}
			loading={isLoading}
			disableSearch={true}
			pageSize={filter.count}
			disableDateRange={true}
			totalCount={totalCount}
			disableClearFilters={true}
			disableColumnVisibility={true}
		/>
	)
}
