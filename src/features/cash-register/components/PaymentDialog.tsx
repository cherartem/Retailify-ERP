import FormLabelForRequiredFields from '@/components/forms/FormLabelForRequiredFields'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowRight } from 'lucide-react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { CashRegisterItem } from '../types/cash-register-order-form-schema'
import { CurrencyFormatter } from '@/components/ui/units'
import PaymentMethodRadioGroup from './PaymentMethodRadioGroup'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any, any, undefined>
}

export default function PaymentDialog({ form }: Props) {
  const [isOpened, setIsOpened] = useState(false)
  const items: CashRegisterItem[] = useWatch({
    control: form.control,
    name: 'items',
  })

  const paymentMethod: 'CARD' | 'CASH' | 'MIXED' = useWatch({
    control: form.control,
    name: 'paymentMethod',
  })

  const [givenCashAmount, setGivenCashAmount] = useState<string | undefined>()
  const [mixedCashAmount, setMixedCashAmount] = useState<string | undefined>()
  const [mixedCardAmount, setMixedCardAmount] = useState<string | undefined>()

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button type='button'>
          <ArrowRight className='h-4 w-4 mr-2' />
          Перейти к оплате
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Оплата</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Размер</TableHead>
              <TableHead className='text-right'>Количество</TableHead>
              <TableHead className='text-right'>Цена</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(({ id, product, size, quantity, price, sale }) => (
              <TableRow key={id}>
                <TableCell className='font-medium'>{product?.title}</TableCell>
                <TableCell>{size}</TableCell>
                <TableCell className='text-right'>{quantity ?? 1}</TableCell>
                <TableCell className='text-right'>
                  <CurrencyFormatter value={price * (1 - (sale ?? 0))} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex items-center justify-between font-medium text-lg border border-input bg-background shadow-sm p-4 rounded-md'>
          <span>К оплате:</span>
          {items && items.length >= 1 ? (
            <CurrencyFormatter
              value={items
                .map(
                  ({ price, quantity, sale }) =>
                    price * (1 - (sale ?? 0)) * (quantity ?? 1)
                )
                .reduce((prev, curr) => prev + curr)}
            />
          ) : (
            <CurrencyFormatter value={0} />
          )}
        </div>
        <FormField
          control={form.control}
          name='paymentMethod'
          render={({ field }) => (
            <FormItem>
              <FormLabelForRequiredFields text='Способ оплаты' />
              <FormControl>
                <PaymentMethodRadioGroup field={field} />
              </FormControl>
            </FormItem>
          )}
        />
        {paymentMethod === 'CASH' && (
          <div className='flex items-center gap-2'>
            <div className='space-y-2'>
              <Label>Дано (грн):</Label>
              <Input
                type='number'
                placeholder='Без сдачи'
                value={givenCashAmount}
                className='h-12 text-lg'
                onChange={(e) => setGivenCashAmount(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label>Сдача (грн):</Label>
              <Input
                type='number'
                className='h-12 text-lg'
                readOnly={true}
                value={(givenCashAmount
                  ? parseFloat(givenCashAmount) -
                    (items && items.length >= 1
                      ? items
                          .map(({ price, quantity }) => price * (quantity ?? 1))
                          .reduce((prev, curr) => prev + curr)
                      : 0)
                  : 0
                ).toFixed(2)}
              />
            </div>
          </div>
        )}
        {paymentMethod === 'MIXED' && (
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <div className='space-y-2'>
                <Label>Наличными (грн):</Label>
                <Input
                  type='number'
                  value={mixedCashAmount}
                  className='h-12 text-lg'
                  onChange={(e) => {
                    const value = e.target.value

                    const leftToFillOut =
                      (items && items.length >= 1
                        ? items
                            .map(
                              ({ price, quantity, sale }) =>
                                price * (1 - (sale ?? 0)) * (quantity ?? 1)
                            )
                            .reduce((prev, curr) => prev + curr)
                        : 0) - (value ? parseFloat(value) : 0)

                    setMixedCashAmount(value)
                    setMixedCardAmount(leftToFillOut.toFixed(2).toString())
                  }}
                />
              </div>
              <div className='space-y-2'>
                <Label>Безналичными (грн):</Label>
                <Input
                  type='number'
                  value={mixedCardAmount}
                  className='h-12 text-lg'
                  onChange={(e) => {
                    const value = e.target.value

                    const leftToFillOut =
                      (items && items.length >= 1
                        ? items
                            .map(
                              ({ price, quantity, sale }) =>
                                price * (1 - (sale ?? 0)) * (quantity ?? 1)
                            )
                            .reduce((prev, curr) => prev + curr)
                        : 0) - (value ? parseFloat(value) : 0)

                    setMixedCardAmount(value)
                    setMixedCashAmount(leftToFillOut.toFixed(2).toString())
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
