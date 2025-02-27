const Loading = () => {
	return (
		<div className='bg-primary/50 h-full w-full'>
			<div className='flex h-full w-full items-center justify-center'>
				<div className='h-32 w-32 animate-spin rounded-full border-b-2 border-white'></div>
			</div>
		</div>
	)
}

export default Loading
