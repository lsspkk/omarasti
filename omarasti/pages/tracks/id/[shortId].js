import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { Layout } from '../../../components/Layout'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { trackState } from '../../../models/state'
import { useEffect, useState } from 'react'
import { getRunAmounts } from '../../api/run/track/[[...id]]'
import dbConnect from '../../../utils/dbConnect'
import { getTrack } from '../../api/tracks/[id]'

const LoadingTrack = ({ loadedTrack, error }) => {
  const { data: session, status } = useSession()
  const [, setTrack] = useRecoilState(trackState)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const { shortId } = router.query

  useEffect(() => {
    if (error === null) {
      setMessage(
        'Onnistui',
        setTimeout(() => setMessage(''), 4000)
      )

      if (loadedTrack === null) {
        // reload/hydrate track after person has logged in
        router.replace(router.asPath)
      } else {
        setTrack(loadedTrack).then(() => router.push('/tracks/view'))
      }
    } else {
      setMessage(
        'Epaonnistui :' + error,
        setTimeout(() => setMessage(''), 4000)
      )
    }
  }, [loadedTrack, error, message])

  if (status === 'loading') return <div>loading...</div>
  if (!session) {
    // when sharing link to track, the person that shares link
    // can tell about the app and need of using google account
    // so we can just do direct sign in and rely on session
    const callbackUrl = window?.location?.href
    signIn({ profile: 'google' }, { callbackUrl })
  }

  return (
    <Layout menu={<div />}>
      <div className='container flex flex-col justify-between'>
        {message.length !== 0 && <div>{message}</div>}
        <h1 className='py-10'>Ladataan rataa {shortId}</h1>
      </div>
      <div className='select-none container flex justify-center'>
        <Link href='/'>
          <Button className='m-8'>Keskeytä</Button>
        </Link>
      </div>
    </Layout>
  )
}

// next.js is happy when using null as return value instead of undefined
export async function getServerSideProps({ params, req, res }) {
  await dbConnect()
  try {
    const data = await getTrack(params.shortId, req, res)
    const track = JSON.parse(JSON.stringify(data))
    const runAmounts = track === null ? null : await getRunAmounts(data._id, req, res)
    const loadedTrack = { ...track, runAmounts: JSON.parse(JSON.stringify(runAmounts)) }
    return { props: { loadedTrack: loadedTrack, error: null } }
  } catch (error) {
    return { props: { loadedTrack: null, error: JSON.stringify(error) } }
  }
}
export default LoadingTrack
