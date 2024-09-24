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
}: {
  onClick?: () => void
  className?: string
  children: ReactNode
}) => {
  const add = className !== undefined ? className : ''
  const margins = add && add.includes('m-') ? '' : ' m-1 md:m-2'
  const paddings = add && add.includes('p-') ? '' : ' p-1 md:p-2'
  const background = add && add.includes('bg-') ? '' : ' bg-orange-300'
  const cName =
    'transition duration-100 select-none text-sm rounded text-orange-900 hover:text-blue-700 inline-block ' +
    add +
    margins +
    paddings +
    background
  return (
    <button className={cName} onClick={onClick}>
      {children}
    </button>
  )
}

export { SignInButton, Button }
