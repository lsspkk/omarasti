import React from 'react'
import Link from 'next/link'
import { Button } from './Buttons'

// Menu item types
export type MenuItemType =
  | {
      type: 'link'
      href: string
      label: string
      className?: string
      onClick?: () => void
    }
  | {
      type: 'button'
      onClick: () => void
      label: string
      className?: string
      variant?: 'primary' | 'secondary' | 'green'
    }
  | {
      type: 'toggle'
      active: boolean
      onClick: () => void
      label: string
      activeClassName?: string
      inactiveClassName?: string
    }
  | {
      type: 'custom'
      component: React.ReactNode
    }

export interface CommonMenuProps {
  title?: string
  items: MenuItemType[]
  layout?: 'horizontal' | 'vertical' | 'flex-between' | 'flex-start'
  className?: string
  titleClassName?: string
}

const defaultToggleStyles = {
  active: 'bg-green-100 border-b-2 border-orange-900',
  inactive: 'bg-green-300',
}

export const CommonMenu: React.FC<CommonMenuProps> = ({
  title,
  items,
  layout = 'horizontal',
  className = '',
  titleClassName = '',
}) => {
  const getLayoutClass = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-2'
      case 'flex-between':
        return 'flex justify-between items-center w-full'
      case 'flex-start':
        return 'flex justify-start items-center gap-2'
      case 'horizontal':
      default:
        return 'flex items-center gap-2'
    }
  }

  const renderMenuItem = (item: MenuItemType, index: number) => {
    switch (item.type) {
      case 'link':
        return (
          <Link key={index} href={item.href}>
            <Button className={item.className || ''} onClick={item.onClick}>
              {item.label}
            </Button>
          </Link>
        )

      case 'button':
        return (
          <Button key={index} onClick={item.onClick} className={item.className || ''} variant={item.variant}>
            {item.label}
          </Button>
        )

      case 'toggle':
        return (
          <Button
            key={index}
            onClick={item.onClick}
            className={
              item.active
                ? item.activeClassName || defaultToggleStyles.active
                : item.inactiveClassName || defaultToggleStyles.inactive
            }
          >
            {item.label}
          </Button>
        )

      case 'custom':
        return <React.Fragment key={index}>{item.component}</React.Fragment>

      default:
        return null
    }
  }

  return (
    <div className={`${getLayoutClass()} ${className}`}>
      {title && <h1 className={`ml-4 ${titleClassName}`}>{title}</h1>}
      {items.map(renderMenuItem)}
    </div>
  )
}

// Utility function to create common menu item types
export const createMenuItems = {
  link: (href: string, label: string, className?: string, onClick?: () => void): MenuItemType => ({
    type: 'link',
    href,
    label,
    className,
    onClick,
  }),

  button: (
    onClick: () => void,
    label: string,
    className?: string,
    variant?: 'primary' | 'secondary' | 'green'
  ): MenuItemType => ({
    type: 'button',
    onClick,
    label,
    className,
    variant,
  }),

  toggle: (
    active: boolean,
    onClick: () => void,
    label: string,
    activeClassName?: string,
    inactiveClassName?: string
  ): MenuItemType => ({
    type: 'toggle',
    active,
    onClick,
    label,
    activeClassName,
    inactiveClassName,
  }),

  custom: (component: React.ReactNode): MenuItemType => ({
    type: 'custom',
    component,
  }),
}
