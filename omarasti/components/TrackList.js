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
    // reloads tracks because path starting with /
    router.push('/tracks')
  }

  if (!tracks) return <div></div>
  return (
    <>
      {tracks.map((track) => (
        <div key={track._id}>
          <div className="border p-5 w-100">
            <div className="flex justify-between content-end m-2">
              <h5 className="text-orange-900 bold text-2xl">{track.name}</h5>
              <p className="track-name ">Sijainti: {track.location}</p>
              <p className="owner">Ratamestari: {track.owner === undefined ? '' : track.owner.name}</p>
            </div>
            <div className="flex justify-between">
              <Button className=""
                onClick={() => toUrl(track, '/tracks/view', 'view')}
              >Näytä</Button>

              <Button className="bg-gray-200"
                onClick={() => remove(track._id)}
              >Poista</Button>

              <Button className=""
                onClick={() => toUrl(track, '/tracks/edit', 'move')}
              >Muokkaa</Button>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default TrackList