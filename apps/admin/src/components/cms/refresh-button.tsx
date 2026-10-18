import type { RefreshButtonProps } from 'types/components/admin'
import { Button } from 'ui/button'
import { classNames } from 'utils/classNames'
import { RefreshCw } from 'components/icons'

export const RefreshButton = ({ loading, onClick, disabled }: RefreshButtonProps) => (
	<Button
		type='button'
		variant='outline'
		size='sm'
		onClick={onClick}
		disabled={disabled ?? loading}>
		<RefreshCw className={classNames('mr-1.5 size-4', loading && 'animate-spin')} />
		Refresh
	</Button>
)
