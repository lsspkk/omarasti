
import { useSession } from 'next-auth/client'
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { ViewMenu } from '../../../components/ViewMenu'
import { trackState } from '../../track'
import { totalDistance } from '../../../utils/location'
import { atom } from 'recoil'

const runState = atom({ key: 'runState', default: undefined })


const emptyRun = { 
  totalTime: -1,
  start: undefined, 
  end: undefined, 
  route: [], 
  markerTimes: [], 
  targetMarker: -1, 
  trackId: undefined,
  currentLatlng: undefined
 }

const StartRun = () => {
  const [session, loading] = useSession()
  const [, setRun] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session || !track) router.push('/')

  async function start() {
    setRun({...emptyRun, trackId: track._id, start: new Date(), targetMarker: 1, currentLatlng: track.markers[0].latlng})
    router.push('/tracks/view')
  }

  const length = totalDistance(track?.markers)

  // TODO check distance from start marker and guide to it
  return (
    <Layout menu={<ViewMenu />}>
      <div className="container flex flex-col justify-between">
        <div className="m-5">
          <h1 className="py-10">Aloita suunnistus</h1>
          <p>
            Mene lähelle ensimmäistä rastipistettä, klikkaa aloita.
            Ajanotto ja reitin seuranta käynnistyy.</p>

          <div className="flex my-5">
            <label className="w-20">Pituus:</label>
            <div className="w-40">{length}</div>
          </div>
        </div>
      </div>
      <div className="container flex justify-center">
        <Button className="m-8" onClick={() => router.push('/tracks/view')} >Takaisin</Button>
        <Button className="m-8" onClick={() => start()} >Aloita</Button>
      </div>
    </Layout>
  )
}

export default StartRun
export { runState }