// components/header.js

import Link from 'next/link'
import { signin, signout, useSession } from 'next-auth/client'
import { SignInButton } from './Buttons'
import { userState } from '../pages/profile'
import { useRecoilState, } from 'recoil'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { runState } from '../models/state'

const Header = ({ menu }) => {
  const [run] = useRecoilState(runState)
  const [session] = useSession()
  const [user, setUser] = useRecoilState(userState)
  const router = useRouter()

  useEffect(async () => {
    // load/create additional user account to mongodb
    if (session && Object.keys(user).length === 0) {
      const res = await fetch('/api/user')
      if (res.ok) {
        const { data } = await res.json()
        if (data) {
          //console.log(data)
          setUser(data)
        }
      }
    }
    if (!session) {
      setUser({})
    }
  }, [session, user])



  const showSignOut = ['/', '/profile', '/tracks'].includes(router.asPath)
  // jos juoksu käynnissä, älä näytä rasti-ikonia
  const showLogo = run === undefined || run?.start === undefined || run?.end !== undefined

  return (
    <header>
      <nav className='md:container mx-auto flex self-center'>
        {showLogo &&
        <Link href='/' >
          <div className='2-10 flex-none w-16 sm:w-30 md:mr-8 '>
            <img src='/logo.svg' alt='omaRasti' className='w-13 sm:w-20 sm:mt-2 sm:mb-2' />
            <span className='absolute top-0 mt-2 sm:mt-4 ml-2 bold opacity-5'>OMA<br />RASTI</span>
          </div>
        </Link>
        }

        <div className='container flex justify-start'>
          {session &&
            { ...menu }
          }
        </div>

        <div className='flex-end flex-3 flex text-sm'>
          {!session && (
            <SignInButton onClick={async () => signin('google')}>Kirjaudu</SignInButton>
          )}
          {session && showSignOut && (
            <>

              <Link href="/profile"><span className={`m-2 self-center inline`}>{session.user.email}</span></Link>
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