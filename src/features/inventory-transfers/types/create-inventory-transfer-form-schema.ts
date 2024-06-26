import { requiredField } from '@/utils/zodErrorMessages'
import { z } from 'zod'

const item = z.object({
  id: z.string(),
  quantity: z.coerce.number(),
  warehouseQuantity: z.number().optional(),
  size: z.string().optional(),
  title: z.string().optional(),
})

export type InventoryTransferItem = z.infer<typeof item>

export const createInventoryTransferFormSchema = z.object({
  date: z.date({ required_error: requiredField }),
  transferItems: z.array(item),
  reasonId: z.string().min(1, requiredField),
  sourceWarehouseId: z.string().min(1, requiredField),
  destinationWarehouseId: z.string().min(1, requiredField),
})

export type CreateInventoryTransferFormSchema = z.infer<
  typeof createInventoryTransferFormSchema
>
