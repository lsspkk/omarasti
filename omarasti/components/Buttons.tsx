import React, { ForwardedRef, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

const SignInButton = React.forwardRef(
  (
    { onClick, className, children }: { onClick?: () => void; className?: string; children: ReactNode },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <button className='select-none rounded bg-orange-400 hover:bg-orange-700 p-2 ' ref={ref} onClick={onClick}>
        {children}
      </button>
    )
  }
)

SignInButton.displayName = 'SignInButton'

const Button = React.forwardRef<
  HTMLButtonElement,
  {
    onClick?: () => void
    className?: string
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'green'
    icon?: LucideIcon
    iconOnly?: boolean // Show only icon on mobile, text + icon on md+
  }
>(({ onClick, className, children, variant = 'primary', icon: Icon, iconOnly = false }, ref) => {
  const variantClasses = {
    primary: 'from-orange-500 to-orange-700 text-white bg-gradient-to-br  shadow-sm  text-center',
    secondary: 'from-gray-400 to-gray-700 text-white bg-gradient-to-br  shadow-sm  text-center',
    green: 'from-green-400 to-green-700 text-white bg-gradient-to-br  shadow-sm  text-center',
  }

  const add = className ?? ''
  const margins = add?.includes('m-') ? '' : ' m-1 md:m-2'
  const paddings = add?.includes('p-') ? '' : ' p-1 md:p-2'
  const variantClass = variantClasses[variant] || ''

  const cName = `transition duration-100 select-none text-sm rounded ${variantClass} ` + add + margins + paddings
  console.debug({ cName })
  return (
    <button ref={ref} className={cName} onClick={onClick}>
      <div className={`flex items-center justify-center gap-2 ${iconOnly ? '' : 'md:gap-2'}`}>
        {Icon && <Icon size={17} className='flex-shrink-0 m-[0.1em]' />}
        {iconOnly ? <span className='hidden md:inline'>{children}</span> : <span>{children}</span>}
      </div>
    </button>
  )
})

Button.displayName = 'Button'

export { SignInButton, Button }
