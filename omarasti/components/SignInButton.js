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

export { SignInButton }
