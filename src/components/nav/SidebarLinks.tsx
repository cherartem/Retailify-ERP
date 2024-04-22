import { Link, useRouteContext } from '@tanstack/react-router'
import {
  BookText,
  Factory,
  GitCompareArrows,
  Home,
  LibraryBig,
  PackagePlus,
  Store,
  Tags,
  User,
  Users,
  Warehouse,
} from 'lucide-react'
import React from 'react'
import { Separator } from '../ui/separator'

export default function SidebarLinks() {
  return (
    <div>
      <Section>
        <SidebarLink
          Icon={Home}
          to='/'
          cashier={true}
          ecommerceManager={true}
          text='Главная'
        />
        <SidebarLink
          Icon={Users}
          to='/employees'
          cashier={false}
          ecommerceManager={false}
          text='Сотрудники'
        />
        <SidebarLink
          Icon={Store}
          to='/points-of-sale'
          cashier={false}
          ecommerceManager={false}
          text='Кассы'
        />
        <SidebarLink
          Icon={Factory}
          to='/suppliers'
          cashier={true}
          ecommerceManager={true}
          text='Поставщики'
        />
        <SidebarLink
          Icon={Warehouse}
          to='/warehouses'
          cashier={false}
          ecommerceManager={false}
          text='Склады'
        />
        <SidebarLink
          Icon={PackagePlus}
          to='/goods-receipts'
          cashier={false}
          ecommerceManager={false}
          text='Приход товара'
        />
        <SidebarLink
          Icon={LibraryBig}
          to='/categories'
          cashier={false}
          ecommerceManager={false}
          text='Категории товара'
        />
        <SidebarLink
          Icon={LibraryBig}
          to='/category-groups'
          cashier={false}
          ecommerceManager={false}
          text='Группы категорий товара'
        />
        <SidebarLink
          Icon={Tags}
          to='/products'
          cashier={false}
          ecommerceManager={false}
          text='Модели товара'
        />
        <SidebarLink
          Icon={BookText}
          to='/inventory-adjustments'
          cashier={false}
          ecommerceManager={false}
          text='Инвентаризация'
        />
        <SidebarLink
          Icon={GitCompareArrows}
          to='/inventory-transfers'
          cashier={false}
          ecommerceManager={false}
          text='Перемещение товара'
        />
      </Section>
      <Separator />
      <Section>
        <SidebarLink
          Icon={User}
          to='/customers'
          cashier={false}
          ecommerceManager={false}
          text='Клиенты'
        />
      </Section>
    </div>
  )
}

function SidebarLink({
  text,
  Icon,
  to,
  cashier,
  ecommerceManager,
}: {
  text: string
  Icon: React.ComponentType<{ className?: string }>
  to: string
  cashier: boolean
  ecommerceManager: boolean
}) {
  const { user } = useRouteContext({ from: '/layout' })
  const handleClose = () => {
    const button = document.getElementById('sheet-close-button')
    if (button) {
      button.click()
    }
  }

  function canDisplay() {
    if (user?.role === 'ADMIN') {
      return true
    } else if (user?.role === 'CASHIER' && cashier) {
      return true
    } else if (user?.role === 'ECOMMERCE_MANAGER' && ecommerceManager) {
      return true
    } else {
      return false
    }
  }

  if (canDisplay()) {
    return (
      <Link
        to={to}
        activeProps={{
          className: 'bg-primary text-white',
        }}
        inactiveProps={{
          className: 'hover:bg-secondary',
        }}
        className='flex px-3 py-2 gap-2 items-center rounded-lg transition-colors group-data-[state=closed]:w-9 group-data-[state=closed]:p-0 group-data-[state=closed]:h-9 group-data-[state=closed]:justify-center'
        onClick={handleClose}
      >
        <Icon className='h-4 w-4 shrink-0' />
        <span className='group-data-[state=closed]:hidden'>{text}</span>
      </Link>
    )
  } else {
    return null
  }
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className='p-3 flex flex-col gap-3'>{children}</div>
}
