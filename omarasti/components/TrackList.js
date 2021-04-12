import { trackState } from '../pages/track'
import { useRecoilState } from 'recoil'
import { Button } from './Buttons'
import { useRouter } from 'next/router'
import { designModeState } from './DesignMenu'

const TrackList = ({ tracks }) => {
  const [, setMode] = useRecoilState(designModeState)
  const [, setTrack] = useRecoilState(trackState)
  const router = useRouter()

  const toUrl = (track, url, mode) => {
    setTrack(track)
    setMode(mode)
    router.push(url)
  }
  const remove = async (id) => {
    const url = `/api/tracks${urlEnd}`
    const res = await fetch(url, {
      method: track._id ? 'PUT' : 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrack),
    })

    if (res.ok) {
      setTrack(newTrack)
    }
    setMessage(res.ok ? 'Tallennettu' : 'Tallennus epäonnistui')
    router.push('/tracks')
  }

  if (!tracks) return <div></div>
  return (
    <>
      {tracks.map((track) => (
        <div key={track._id}>
          <div className="border p-5 w-100">
            <div className="flex justify-between content-end">
              <div>
                <div className="inline-block text-orange-900 bold text-2xl">{track.name}</div>
              </div>

              <p className="owner">Ratamestari: {track.owner === undefined ? '' : track.owner.name}</p>
            </div>
            <div className="flex justify-between">
              <div>
              <div className="track-name ">{ track.location !== '' && <> Sijainti: {track.location} </> }
              </div>
              <Button className="w-14" onClick={() => toUrl(track, '/tracks/view', 'view')}>Näytä</Button>
              </div>

              <div className="flex">

              {!track.published &&
                <Button className="self-end"
                  onClick={() => toUrl(track, '/tracks/edit', 'move')}
                >Muokkaa</Button>
              }

              <Button className="self-end bg-red-200"
                onClick={() => remove(track._id)}
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