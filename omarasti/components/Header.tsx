import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { SignInButton } from './Buttons'
import { userState } from '../pages/settings'
import { useRecoilState } from 'recoil'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { runState } from '../models/state'

export const Header = ({ menu }) => {
  const [run] = useRecoilState(runState)
  const { data: session } = useSession()
  const [user, setUser] = useRecoilState(userState)
  const [isSigning, setIsSigning] = useState(false)
  const router = useRouter()

  async function fetchUser() {
    // load/create additional user account to mongodb
    if (session && (!user || Object.keys(user).length === 0)) {
      setIsSigning(true)
      const res = await fetch('/api/user')
      if (res.ok) {
        const { data } = await res.json()
        if (data) {
          // console.log(data)
          setUser(data)
        }
      }
      setIsSigning(false)
    } else if (!session) {
      setUser(undefined)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [session])

  const showSignOut = ['/', '/profile'].includes(router.asPath)
  // jos juoksu käynnissä, älä näytä rasti-ikonia
  const showLogo = run === undefined || run?.start === undefined || run?.end !== undefined

  return (
    <header className='w-full border-b border-gray-300 bg-white p-1 print:hidden'>
      <nav className='md:container mx-auto flex self-center'>
        {showLogo && (
          <Link href='/'>
            <div className='2-10 flex-none w-16 sm:w-30 md:mr-8 '>
              <img src='/logo.svg' alt='omaRasti' className='w-13 sm:w-20 sm:mt-2 sm:mb-2' />
              <span className='absolute top-0 mt-2 sm:mt-4 ml-2 bold opacity-5'>
                OMA
                <br />
                RASTI
              </span>
            </div>
          </Link>
        )}

        <div className='container flex justify-end'>{session && { ...menu }}</div>

        <div className='flex-end flex-3 flex text-sm'>
          {isSigning && <div>...</div>}

          {!session && !isSigning && <SignInButton onClick={async () => signIn('google')}>Kirjaudu</SignInButton>}
        </div>
      </nav>

      <style jsx>
        {`
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
