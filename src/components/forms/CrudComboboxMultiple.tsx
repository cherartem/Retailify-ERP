import { useScrollToFetchData } from '@/hooks/useScrollToFetchData'
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query'
import { debounce } from 'lodash'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button, buttonVariants } from '../ui/button'
import { ChevronsUpDown, Loader2, X } from 'lucide-react'
import { Command, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { Checkbox } from '../ui/checkbox'
import { cn } from '@/lib/utils'

type Props<Entity, EntityFindAll> = {
  setQuery: React.Dispatch<React.SetStateAction<string>>
  data: InfiniteData<EntityFindAll, unknown> | undefined
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<EntityFindAll, unknown>, Error>
  >
  hasNextPage: boolean
  isFetching: boolean
  isFetchingNextPage: boolean
  status: 'error' | 'pending' | 'success'
  placeholder: string
  idField: keyof Entity
  nameField: keyof Entity
  itemsField: keyof EntityFindAll
  EditDialog?: ({
    id,
    onSuccess,
  }: {
    id: string
    onSuccess?: (id: string) => void
  }) => JSX.Element
  DeleteAlertDialog?: ({
    id,
    onSuccess,
  }: {
    id: string
    onSuccess?: (id: string) => void
  }) => JSX.Element
  CreateDialog?: () => JSX.Element
  selectedValues: Entity[]
  setSelectedValues: (newValues: Entity[]) => void
  onSuccess?: (id: string) => void
}

export default function CrudComboboxMultiple<Entity, EntityFindAll>({
  setQuery,
  data,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  status,
  placeholder,
  idField,
  nameField,
  itemsField,
  CreateDialog,
  DeleteAlertDialog,
  EditDialog,
  selectedValues,
  setSelectedValues,
  onSuccess,
}: Props<Entity, EntityFindAll>) {
  const [searchInputValue, setSearchInputValue] = useState('')
  const [isOpened, setIsOpened] = useState(false)

  const setQueryValue = useCallback(
    (value: string) => {
      setQuery(value)
    },
    [setQuery]
  )

  const debouncedSetQueryValue = useMemo(() => {
    return debounce(setQueryValue, 300)
  }, [setQueryValue])

  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(
    null
  )
  useScrollToFetchData(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    observerTarget
  )

  return (
    <Popover open={isOpened} onOpenChange={setIsOpened} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={isOpened}
          className='w-full justify-between'
        >
          {selectedValues && selectedValues.length >= 1 ? (
            <div className='flex items-center gap-2'>
              <div
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'icon' }),
                  'h-6 w-6'
                )}
                onClick={(e) => {
                  e.stopPropagation()

                  setSelectedValues([])
                }}
              >
                <X className='h-4 w-4' />
              </div>
              <span className='truncate max-w-64'>
                {selectedValues.length <= 3
                  ? selectedValues.map((obj) => obj[nameField]).join(', ')
                  : `Выбрано: ${selectedValues.length}`}
              </span>
            </div>
          ) : (
            <span className='text-muted-foreground font-normal'>
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Поиск...'
            className='h-9'
            value={searchInputValue}
            onValueChange={(value) => {
              setSearchInputValue(value)
              debouncedSetQueryValue(value)
            }}
          />
          <CommandGroup className='max-h-40 overflow-y-auto'>
            {status === 'pending' ? (
              <Loading />
            ) : status === 'error' ? (
              <Error />
            ) : (
              <>
                {data && data.pages && data.pages.length >= 1 ? (
                  data.pages.map((group, i) => {
                    const items = group[itemsField] as Entity[]

                    return (
                      <Fragment key={i}>
                        {items.map((item) => {
                          const id = String(item[idField])
                          const name = String(item[nameField])
                          const isSelected = selectedValues.some(
                            (obj) => obj[idField] === item[idField]
                          )

                          return (
                            <CommandItem
                              key={id}
                              value={id}
                              className='flex items-center justify-between gap-2 cursor-pointer'
                              onSelect={() => {
                                if (isSelected) {
                                  setSelectedValues(
                                    selectedValues.filter(
                                      (obj) => obj[idField] !== id
                                    )
                                  )
                                } else {
                                  setSelectedValues([...selectedValues, item])
                                }
                              }}
                            >
                              <div className='flex items-center gap-2'>
                                <Checkbox checked={isSelected} />
                                <span>{name}</span>
                              </div>
                              {(EditDialog || DeleteAlertDialog) && (
                                <div
                                  className='flex items-center gap-2'
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {EditDialog && (
                                    <EditDialog id={id} onSuccess={onSuccess} />
                                  )}
                                  {DeleteAlertDialog && (
                                    <DeleteAlertDialog
                                      id={id}
                                      onSuccess={onSuccess}
                                    />
                                  )}
                                </div>
                              )}
                            </CommandItem>
                          )
                        })}
                      </Fragment>
                    )
                  })
                ) : (
                  <NoResults />
                )}
                <div ref={(element) => setObserverTarget(element)}></div>
                {(isFetching || isFetchingNextPage) && <Loading />}
              </>
            )}
          </CommandGroup>
          {CreateDialog && (
            <CommandGroup className='border-t border-t-input'>
              <CreateDialog />
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function Loading() {
  return (
    <div className='w-full h-full flex items-center justify-center gap-1 text-sm text-muted-foreground'>
      <Loader2 className='h-3.5 w-3.5 animate-spin' />
      Загрузка...
    </div>
  )
}

export function Error() {
  return (
    <div className='w-full h-full flex items-center justify-center text-sm text-destructive'>
      Произошла ошибка при загрузке.
    </div>
  )
}

export function NoResults() {
  return (
    <div className='w-full h-full flex items-center justify-center gap-1 text-sm text-muted-foreground'>
      Нет результатов.
    </div>
  )
}
