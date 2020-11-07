// components/header.js

import Link from 'next/link'
import { signin, signout, useSession } from 'next-auth/client'
import { SignInButton } from './SignInButton'

const Header = () => {
  const [session, loading] = useSession()
  return (
    <header>
      <nav className='container mx-auto'>
        <Link href='/'>
          <a className='logo'>
            <img src='/logo.png' alt='omaRasti' />
          </a>
        </Link>

        {session &&
          <Link
            href='/design'
            className='m-2 text-sm text-blue:500 hover:text-blue:800'
          >
            Tee rata
          </Link>}

        <p>
          {!session && (
            <SignInButton onClick={() => signin('google')}>Kirjaudu</SignInButton>
          )}
          {session && (
            <>
              <Link href='/profile'>
                <span className='m-2 text-sm'>{session.user.email}</span>
              </Link>
              <SignInButton onClick={signout}>Kirjaudu ulos</SignInButton>
            </>
          )}
        </p>
      </nav>

      <style jsx>{`
        header {
          border-bottom: 1px solid #ccc;
        }
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .avatar {
          border-radius: 2rem;
          float: left;
          height: 2.2rem;
          width: 2.2rem;
          background-color: white;
          background-size: cover;
          border: 2px solid #ddd;
        }
        .email {
          margin-right: 1rem;
          font-size: 0.8rem;
          vertical-align: middle;
          margin-left: 0.25rem;

        }
      `}
      </style>
    </header>
  )
}

export default Header
