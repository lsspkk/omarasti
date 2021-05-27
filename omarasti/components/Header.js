import Link from 'next/link'
import { signin, useSession } from 'next-auth/client'
import { SignInButton } from './Buttons'
import { userState } from '../pages/settings'
import { useRecoilState, } from 'recoil'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { runState } from '../models/state'

const Header = ({ menu }) => {
  const [run] = useRecoilState(runState)
  const [session] = useSession()
  const [user, setUser] = useRecoilState(userState)
  const [isSigning, setIsSigning] = useState(false)
  const router = useRouter()

  useEffect(async () => {
    // load/create additional user account to mongodb
    if (session && Object.keys(user).length === 0) {
      setIsSigning(true)
      const res = await fetch('/api/user')
      if (res.ok) {
        const { data } = await res.json()
        if (data) {
          //console.log(data)
          setUser(data)
        }
      }
      setIsSigning(false)
    }
    if (!session) {
      setUser({})
    }
  }, [session, user])



  const showSignOut = ['/', '/profile'].includes(router.asPath)
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

        <div className='container flex justify-end'>
          {session &&
            { ...menu }
          }
        </div>

        <div className='flex-end flex-3 flex text-sm'>
          { isSigning && <div>...</div> }

          {!session && !isSigning && (
            <SignInButton onClick={async () => signin('google')}>Kirjaudu</SignInButton>
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