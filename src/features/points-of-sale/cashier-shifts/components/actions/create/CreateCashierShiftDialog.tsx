import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import CreateCashierShiftForm from './CreateCashierShiftForm'

export default function CreateCashierShiftDialog({ posId }: { posId: string }) {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Открыть
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Открыть смену кассира</DialogTitle>
        </DialogHeader>
        <CreateCashierShiftForm setIsOpened={setIsOpened} posId={posId} />
      </DialogContent>
    </Dialog>
  )
}