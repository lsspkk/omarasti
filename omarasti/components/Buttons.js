import React from 'react'

const SignInButton = React.forwardRef(({onClick, href, className, children}, ref) => {
  return (
    <button
      className='select-none rounded bg-orange-400 hover:bg-orange-700 p-2 '
      href={href}
      ref={ref}
      onClick={onClick}
      >
      {children}
    </button>
  )
})

const Button = React.forwardRef(({onClick, href, className, children}, ref) => {

  const add = className !== undefined ? className : '' 
  const margins = add && add.includes('m-') ? '' : ' m-1 md:m-2'
  const paddings = add && add.includes('p-') ?  '' : ' p-1 md:p-2'
  const background = add && add.includes('bg-') ?  '' : ' bg-orange-300'
  const cName = " select-none text-sm rounded text-orange-900 hover:text-blue-700 inline-block " + add + margins + paddings + background 
  return (
    <a
      className={cName}
      href={href}
      ref={ref}
      onClick={onClick}
      >
      {children}
    </a>
  )
})

export { SignInButton, Button }