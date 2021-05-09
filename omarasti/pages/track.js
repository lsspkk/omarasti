
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { Button } from '../components/Buttons'
import { trackState } from '../models/state'
import { useRecoilState } from 'recoil'
import { totalDistance } from '../utils/location'
import { TrackDistance } from '../components/Distance'

const TrackMenu = () => {
  const { asPath } = useRouter()
  return <>
    <Link href="/tracks"><Button>Radat</Button></Link>
    { asPath === '/track' && <Link href="/tracks/edit"><Button>Rastit</Button></Link>}
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
  if (!session || !track) {router.push('/');return<div/>}

  useEffect(() => {
    if (track !== undefined) {
      setName(track.name)
      setLocation(track.location)
    }
  }, [track])


  const save = async ({ published }) => {
    const newTrack = { ...track, published, name, location, modified: new Date() }
    const urlEnd = track._id !== undefined ? ('/' + track._id) : ''
    const url = `/api/tracks${urlEnd}`
    const res = await fetch(url, { 
      method: track._id ? 'PUT' : 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrack),
    })

    if (res.ok) {
      const savedTrack = await res.json()
      console.log(savedTrack.data)
      setTrack(savedTrack.data)
    }
    setMessage(res.ok ? 'Tallennettu' : 'Tallennus epäonnistui')
    setTimeout(() => setMessage(''), 2000)
  }
  const length = totalDistance(track.markers)

  return (
    <Layout menu={<TrackMenu/>}>
      <div>{track?._id} </div>
      { message !== '' && <div className="text-center text-grey-800">{message}</div>}
      <div className="container flex justify-between">

        <div className="m-5 w-64">
        <h1 className="py-10">Radan tiedot</h1>

        <div className="flex my-5">
          <label className="w-20">Nimi:</label>
          <input className="w-40" value={name} disabled={track.published} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex my-5">
          <label className="w-20">Sijainti:</label>
          <input className="w-40" value={location} disabled={track.published} onChange={(e) => setLocation(e.target.value)} />
        </div>


        <div className="flex my-5">
          <TrackDistance markers={track.markers}/>
        </div>
        </div>
        {!track.published &&

          <div className="py-10 w-34">
            <div>
            <Button onClick={() => save({ published: false })}>Tallenna</Button>
            </div>
            <div>
            <Button onClick={() => save({ published: true })} >Julkaise</Button>
            </div>
          </div>
        }
      </div>
    </Layout>
  )
};

export default OneTrack
export { trackState }