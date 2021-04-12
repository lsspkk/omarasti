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
  const cName = props?.className +" sm:m-1 md:m-2 text-sm rounded bg-orange-300 p-2 text-orange-900 hover:text-blue-700"
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