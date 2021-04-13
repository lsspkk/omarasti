import { useState } from 'react'
import { trackState } from '../pages/track'
import { useRecoilState } from 'recoil'
import { Button } from './Buttons'
import { useRouter } from 'next/router'
import { designModeState } from './DesignMenu'

const TrackList = ({ tracks }) => {
  const [, setMode] = useRecoilState(designModeState)
  const [, setTrack] = useRecoilState(trackState)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const toUrl = (track, url, mode) => {
    setTrack(track)
    setMode(mode)
    router.push(url)
  }
  const remove = async (id, name) => {
    const url = `/api/tracks/${id}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json'},
    })

    setMessage(`Rata ${name} ${res.ok ? 'poistettu.' : 'Poistaminen epäonnistui'}`)
    setTimeout(() => setMessage(''), 3000)
    if (res.ok) {
      router.replace(router.asPath)
    }

  }

  if (!tracks) return <div></div>
  return (
    <>
      { message !== '' && <div>{message}</div>}

      {tracks.map((track) => (
        <div key={track._id}>
          <div className="border p-5 w-100">
            <div className="flex justify-between content-end">
              <div>
                <div className="inline-block text-orange-900 bold text-2xl">{track.name}</div>
              </div>

              <p className="owner text-gray-600 text-sm">Ratamestari: {track.owner === undefined ? '' : track.owner.name}</p>
            </div>
            <div className="flex justify-between">
              <div>
              <div className="track-name ">{ track.location !== '' && <> Sijainti: {track.location} </> }</div>
              <Button className="inline-block m-0 md:m-0 mt-1 md:mt-2" onClick={() => toUrl(track, '/tracks/view', 'view')}>Näytä</Button>
              </div>

              <div className="flex">

              {!track.published &&
                <Button className="self-end"
                  onClick={() => toUrl(track, '/tracks/edit', 'move')}
                >Muokkaa</Button>
              }

              <Button className="self-end bg-red-200"
                onClick={() => remove(track._id, track.name)}
              >Poista</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default TrackList