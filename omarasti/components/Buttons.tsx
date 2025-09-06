import React, { ForwardedRef, ReactNode } from 'react'

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

const Button = ({
  onClick,
  className,
  children,
  variant = 'primary',
}: {
  onClick?: () => void
  className?: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'green'
}) => {
  const variantClasses = {
    primary: 'bg-orange-300 text-orange-900 hover:text-blue-700',
    secondary: 'bg-gray-400 text-gray-800 hover:bg-gray-600',
    green: 'bg-green-500 text-white',
  }

  const add = className ?? ''
  const margins = add?.includes('m-') ? '' : ' m-1 md:m-2'
  const paddings = add?.includes('p-') ? '' : ' p-1 md:p-2'
  const variantClass = variantClasses[variant] || ''

  const cName =
    `transition duration-100 select-none text-sm rounded inline-block ${variantClass} ` + add + margins + paddings

  return (
    <button className={cName} onClick={onClick}>
      {children}
    </button>
  )
}

export { SignInButton, Button }
