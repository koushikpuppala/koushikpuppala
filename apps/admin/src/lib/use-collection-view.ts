'use client'

import type { ListResult } from 'types/api'
import type {
	CollectionItem,
	CollectionViewOptions,
	CollectionViewState,
} from 'types/components/admin'
import { useMemo, useState } from 'react'
import { useServerList } from 'lib/use-server-list'

export const useCollectionView = <R extends ListResult<unknown>, Row extends CollectionItem, P>({
	list,
	listOptions,
	toRow,
	save,
	remove,
	togglePublish,
}: CollectionViewOptions<R, Row, P>): CollectionViewState<Row, P> => {
	const { items, total, loading, error, setError, reload } = useServerList(list, listOptions)
	const [open, setOpen] = useState(false)
	const [record, setRecord] = useState<Row | null>(null)

	const rows = useMemo(() => items.map(toRow), [items])

	const openDialog = (row: Row | null) => {
		setRecord(row)
		setOpen(true)
	}

	const onSave = async (data: P) => {
		const res = await save(record?.id, data)

		if (res.error) throw new Error(res.error)

		await reload()
	}

	const onDelete = async (row: Row) => {
		const res = await remove(row.id)

		if (res.error) throw new Error(res.error)

		await reload()
	}

	const onTogglePublish = async (row: Row) => {
		setError(null)

		const res = await togglePublish(row)

		if (res.error) {
			setError(res.error)
			return
		}

		await reload()
	}

	return {
		manager: {
			items: rows,
			totalCount: total,
			loading,
			error,
			onRetry: reload,
			onCreate: () => openDialog(null),
			onEdit: openDialog,
			onDelete,
			onTogglePublish,
		},
		dialog: { open, onOpenChange: setOpen, record, onSave },
	}
}
