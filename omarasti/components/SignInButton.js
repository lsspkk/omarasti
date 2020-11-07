const SignInButton = (props) => {
  return (
    <button
      {...props}
      className='rounded bg-orange-500 hover:bg-orange-700 p-2 '
    >
      {props.children}
    </button>
  )
}

export { SignInButton }
