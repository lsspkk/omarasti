
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { useRouter } from 'next/router'
import { Button } from '../components/Buttons'
import { trackState } from '../models/state'
import { useRecoilState } from 'recoil'
import { totalDistance } from '../utils/location'
import { TrackDistance } from '../components/Distance'


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
      setTrack(savedTrack.data)
    }
    setMessage(res.ok ? 'Tallennettu' : 'Tallennus epäonnistui')
    setTimeout(() => setMessage(''), 2000)
  }
  const length = totalDistance(track.markers)

  return (
    <Layout menu={<Button onClick={() => router.back()} className="mr-4">Takaisin</Button>}>
      { message !== '' && <div className="text-center text-gray-600">{message}</div>}

      <div className="flex justify-center">
        <div>
        <h1 className="mb-4">Radan tiedot</h1>
      <div className="container flex justify-between">

        <div className="mb-4">

        <div className="flex my-1">
          <label className="w-20">Nimi:</label>
          <input className="w-40" value={name} disabled={track.published} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex my-5">
          <label className="w-20">Sijainti:</label>
          <input className="w-40" value={location} disabled={track.published} onChange={(e) => setLocation(e.target.value)} />
        </div>


        <div className="flex mt-5 mb-8 ml-3">
          <TrackDistance markers={track.markers}/>
        </div>
        </div>
        </div>

        {!track.published &&
        <div className="block float-left">
        <div className="container px-2 w-full flex justify-end items-center">
            <div className="mr-2 w-full ">
            Tallennettu rata näkyy vain sinulle.<br/>
            Voit muokata sitä ja suunnistaa radan.
            </div>
            <Button onClick={() => save({ published: false })}>Tallenna</Button>
            </div>
            <div className="mt-12 container px-2 w-full flex justify-end items-center">
            <div className="mr-2 w-full ">
            Julkaistu rata näkyy kaikille.<br/>
            Sitä ei voi muokata.
            </div>
            <Button onClick={() => save({ published: true })} >Julkaise</Button>
          </div>
            </div>
        }
        </div>
        </div>
    </Layout>
  )
};

export default OneTrack