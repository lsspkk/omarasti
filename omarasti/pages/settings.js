import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Layout } from '../components/Layout'
import { atom, useRecoilState } from 'recoil'
import { Button } from '../components/Buttons'

const userState = atom({ key: 'userState', default: {} })

const Profile = () => {
  const { data: session, status } = useSession()
  const [user, setUser] = useRecoilState(userState)
  const [userName, setUserName] = useState(user?.name ? user.name : '')
  const router = useRouter()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (session && user) {
      setUserName(user.name ? user.name : '')
    }
  }, [session, user])

  if (status === 'loading') return <div>loading...</div>
  if (!session) {
    router.push('/')
    return <div>redirecting...</div>
  }

  const saveUserName = async () => {
    const newUser = { ...user, name: userName }
    fetch('/api/user', {
      method: 'PUT',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((res) => {
        setMessage(res.ok ? 'Tallennettu' : 'Tallennus epäonnistui')
        setTimeout(() => setMessage(''), 2000)
      })
      .catch((e) => console.log(e))

    setUser(newUser)
  }

  return (
    <Layout
      menu={
        <Button className='justify-end' onClick={() => router.back()}>
          Takaisin
        </Button>
      }
    >
      {message !== '' && <div className='text-center text-gray-600'>{message}</div>}
      <div className='container mx-auto'>
        <div className='px-4'>
          <h1 className='pt-4'>Google-tunnus</h1>
          <div className='text-gray-700 pb-5'>Tiedot eivät näy OmaRastin käyttäjille</div>

          <div className='pb-5'>{session.user.email}</div>
          <div className='py-2'>
            <Button
              onClick={() => {
                signOut()
                router.push('/')
              }}
            >
              Kirjaudu ulos
            </Button>
          </div>
          <h1 className='pt-12'>Asetukset</h1>
          <div className='text-gray-700 pb-5'>Tiedot näkyvät OmaRastin käyttäjille</div>
          <div className='pb-2'>Ratamestari ja suunnistusnimi:</div>
          <div>
            <input className='' value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>

          <div className='py-12'>
            <Button className='inline' onClick={() => saveUserName()}>
              Tallenna
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
export { userState }
