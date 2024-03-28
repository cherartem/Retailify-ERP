import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReactNode, useState } from 'react'
import CashierOrdersList from './CashierOrdersList'

type Props = {
  trigger?: ReactNode
  setIsOpenedCustom: React.Dispatch<React.SetStateAction<boolean>>
  isOpenedCustom: boolean
}

export default function CashierOrdersDialog({
  trigger,
  isOpenedCustom,
  setIsOpenedCustom,
}: Props) {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <Dialog
      open={isOpenedCustom ?? isOpened}
      onOpenChange={setIsOpenedCustom ?? setIsOpened}
    >
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Продажи</DialogTitle>
        </DialogHeader>
        <CashierOrdersList />
      </DialogContent>
    </Dialog>
  )
}