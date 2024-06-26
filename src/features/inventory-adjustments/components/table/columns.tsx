import SortableDataTableHeader from '@/components/ui/sortable-data-table-header'
import { DateFormatter } from '@/components/ui/units'
import { InventoryAdjustment } from '@/types/entities/InventoryAdjustment'
import { ColumnDef } from '@tanstack/react-table'
import InventoryAdjustmentActions from './InventoryAdjustmentActions'

export const columns: ColumnDef<InventoryAdjustment>[] = [
  {
    id: 'Название',
    header: () => (
      <SortableDataTableHeader
        label='Название'
        orderByProperty='name'
        routeId='/layout/inventory-adjustments'
      />
    ),
    cell: ({ row }) => {
      return <span className='font-medium'>{row.original.name}</span>
    },
  },
  {
    id: 'Дата',
    accessorKey: 'date',
    header: () => (
      <SortableDataTableHeader
        label='Дата'
        orderByProperty='date'
        routeId='/layout/inventory-adjustments'
      />
    ),
    cell: ({ row }) => <DateFormatter date={row.original.date} />,
  },
  {
    id: 'Причина',
    header: 'Причина',
    accessorFn: ({ reason }) => reason?.name,
  },
  {
    id: 'Склад',
    header: 'Склад',
    accessorFn: ({ warehouse }) => warehouse?.name,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id, isArchived } = row.original

      return <InventoryAdjustmentActions id={id} isArchived={isArchived} />
    },
    enableSorting: false,
    enableHiding: false,
  },
]
