const Loading = () => {
	return (
		<div className='h-full w-full bg-primary/50'>
			<div className='flex h-full w-full items-center justify-center'>
				<div className='h-32 w-32 animate-spin rounded-full border-b-2 border-white'></div>
			</div>
		</div>
	)
}

export default Loading
