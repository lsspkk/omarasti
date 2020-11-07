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
          <a className='2-10 w-20 mt-2 mb-2'>
            <img src='/logo.svg' alt='omaRasti' />
            <span style={{ position: 'absolute', top: '21px', marginLeft: '11px', fontWeight: 'bold', opacity: '0.6', fontSize: '20px', lineHeight: '25px' }}>OMA<br />RASTI</span>
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
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}
      </style>
    </header>
  )
}

export default Header
