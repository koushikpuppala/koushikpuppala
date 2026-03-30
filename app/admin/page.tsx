import { DataTable } from 'components'
// import { useAuth } from 'contexts'
import type { SearchParamsProps } from 'types/app'
import type { DataTableFilters } from 'types/components'

const HomePage = async ({ searchParams }: SearchParamsProps) => {
	const params = await searchParams
	// const { login } = useAuth()

	const data = [
		{ id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@example.com' },
		{ id: '3u1reuv4', amount: 242, status: 'success', email: 'Abe45@example.com' },
		{ id: 'derv1ws0', amount: 837, status: 'processing', email: 'Monserrat44@example.com' },
		{ id: '5kma53ae', amount: 874, status: 'success', email: 'Silas22@example.com' },
		{ id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@example.com' },
		{ id: 'm5gr84i91', amount: 316, status: 'success', email: 'ken99@example.com' },
		{ id: '3u1reuv41', amount: 242, status: 'success', email: 'Abe45@example.com' },
		{ id: 'derv1ws01', amount: 837, status: 'processing', email: 'Monserrat44@example.com' },
		{ id: '5kma53ae1', amount: 874, status: 'success', email: 'Silas22@example.com' },
		{ id: 'bhqecj4p1', amount: 721, status: 'failed', email: 'carmella@example.com' },
		{ id: 'm5gr84i92', amount: 316, status: 'success', email: 'ken99@example.com' },
		{ id: '3u1reuv42', amount: 242, status: 'success', email: 'Abe45@example.com' },
		{ id: 'derv1ws02', amount: 837, status: 'processing', email: 'Monserrat44@example.com' },
		{ id: '5kma53ae2', amount: 874, status: 'success', email: 'Silas22@example.com' },
		{ id: 'bhqecj4p2', amount: 721, status: 'failed', email: 'carmella@example.com' },
	]

	// const search = searchParams.get('search') || ''
	const email = params.email?.toString() || ''
	const status = params.status?.toString() || ''
	const page = params.page ? Number(params.page) : 1
	const pageSize = params.pageSize ? Number(params.pageSize) : 10

	const filters: DataTableFilters[] = [
		{ id: 'amount', label: 'Search Amount...', type: 'search' },
		{
			id: 'email',
			label: 'Filter by Email',
			type: 'search-select',
			options: Array.from(new Set(data.map(item => item.email)))
				.sort((a, b) => a.localeCompare(b))
				.map(email => ({ label: email, value: email })),
		},
		{
			id: 'status',
			label: 'Filter by Status',
			type: 'select',
			options: [
				{ label: 'Success', value: 'success' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Failed', value: 'failed' },
			],
		},
	]

	const filteredData = data
		.filter(item => (status ? item.status.toLowerCase() === status.toLowerCase() : true))
		.filter(item => item.email.toLowerCase().includes(email.toLowerCase()))

	return (
		<div className='flex h-full w-full flex-col items-center justify-center text-white'>
			{/* <h1 className='text-4xl font-bold'>Welcome to the Admin Dashboard</h1>
			<p className='mt-2 text-lg'>Manage your application settings and content here.</p>
			<button
				onClick={() => {
					login()
				}}>
				login
			</button> */}
			<DataTable
				filters={filters}
				totalCount={filteredData.length}
				columns={[
					{ accessorKey: 'status', header: 'Status', enableSorting: false },
					{ accessorKey: 'email', header: 'Email', enableHiding: false },
					{ accessorKey: 'amount', header: 'Amount' },
				]}
				disablePageSizeOptions
				data={filteredData.slice((page - 1) * pageSize, page * pageSize)}
			/>
		</div>
	)
}

export default HomePage
