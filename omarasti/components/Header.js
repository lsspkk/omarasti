// components/header.js

import Link from 'next/link'
import { signin, signout, useSession } from 'next-auth/client'
import { SignInButton } from './Buttons'
import { userState } from '../pages/profile'
import { useRecoilState, } from 'recoil'
import { useEffect } from 'react'

const Header = ({ menu }) => {
  const [session] = useSession()
  const [user, setUser] = useRecoilState(userState)

  useEffect(async () => {
    // load/create additional user account to mongodb
    if (session && Object.keys(user).length === 0) {
      const res = await fetch('/api/user')
      if (res.ok) {
        const { data } = await res.json()
        if (data) {
          console.log(data)
          setUser(data)
        }
      }
    }
    if (!session) {
      setUser({})
    }
  }, [session, user])

  return (
    <header>
      <nav className='container mx-auto flex self-center'>
        <Link href='/' >
          <div className='2-10 flex-none w-30 mr-8'>
            <img src='/logo.svg' alt='omaRasti' className='w-20 mt-2 mb-2' />
            <span style={{ position: 'absolute', top: '21px', marginLeft: '11px', fontWeight: 'bold', opacity: '0.6', fontSize: '20px', lineHeight: '25px' }}>OMA<br />RASTI</span>
          </div>
        </Link>

        <div className='container flex justify-start'>
          {session &&
            { ...menu }
          }
        </div>

        <div className='flex-end flex-3 flex text-sm'>
          {!session && (
            <SignInButton onClick={async () => signin('google')}>Kirjaudu</SignInButton>
          )}
          {session && (
            <>

              <Link href="/profile"><span className='m-2 self-center'>{session.user.email}</span></Link>
              <SignInButton onClick={signout}>Kirjaudu ulos</SignInButton>
            </>
          )}
        </div>
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