const SignInButton = (props) => {
  return (
    <button
      {...props}
      className='rounded bg-orange-400 hover:bg-orange-700 p-2 '
    >
      {props.children}
    </button>
  )
}
const Button = (props) => {

  const add = props?.className? props?.className : '' 
  const margins = add && add.includes(' m-') ? '' : ' m-1 md:m-2'
  const paddings = add && add.includes(' p-') ?  '' : ' p-1 md:p-2'
  const cName = "text-sm rounded bg-orange-300 text-orange-900 hover:text-blue-700 " + add + margins + paddings  
  return (
    <div
      {...props}
      className={cName}
      >
      {props.children}
    </div>
  )
}

export { SignInButton, Button }