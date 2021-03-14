
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { Button } from '../components/Buttons'
import { atom, useRecoilState } from 'recoil'
const trackState = atom({ key: 'trackState', default: undefined })

const TrackMenu = () => {
  const { asPath } = useRouter()
  return <>
    <Link href="/tracks"><Button>Radat</Button></Link>
    { asPath === '/track' && <Link href="/design"><Button>Rastit</Button></Link>}
  </>
}

const OneTrack = () => {
  const [session, loading] = useSession()
  const [track, setTrack] = useRecoilState(trackState)
  const [name, setName] = useState(track?.name ? track.name : '')
  const [location, setLocation] = useState(track?.location ? track.location : '')
  const [message, setMessage] = useState('')
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session || !track) router.push('/')

  useEffect(() => {
    if (track !== undefined) {
      setName(track.name)
      setLocation(track.location)
    }
  }, [track])


  const save = async ({ published }) => {
    const newTrack = { ...track, published, name, location, modified: new Date() }
    const url = `/api/tracks${(track._id) && `/${track._id}`}`

    const res = await fetch(url, { 
      method: track._id ? 'PUT' : 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrack),
    })

    if (res.ok) {
      setTrack(newTrack)
    }
    setMessage(res.ok ? 'Tallennettu' : 'Tallennus epäonnistui')
    setTimeout(() => setMessage(''), 2000)
  }


  return (
    <Layout menu={<TrackMenu/>}>
      <div className="container flex justify-between">
        <div className="m-5 w-64">
        <h1 className="py-10">Radan tiedot</h1>

        {message.length > 0 && <div className="text-grey-500">{message}</div>}

        <div className="flex my-5">
          <label className="w-20">Nimi:</label>
          <input className="w-40" value={name} disabled={track.published} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex my-5">
          <label className="w-20">Sijainti:</label>
          <input className="w-40" value={location} disabled={track.published} onChange={(e) => setLocation(e.target.value)} />
        </div>


        <div className="flex my-5">
          <label className="w-20">Pituus:</label>
          <div className="w-40">{track.length}</div>
        </div>
        </div>
        {!track.published &&

          <div className="py-10 w-34">
            <Button onClick={() => save({ published: false })}>Tallenna</Button>
            <Button onClick={() => save({ published: true })} >Julkaise</Button>
          </div>
        }
      </div>
    </Layout>
  )
};

export default OneTrack
export { trackState }