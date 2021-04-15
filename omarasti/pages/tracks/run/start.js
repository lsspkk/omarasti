
import { useSession } from 'next-auth/client'
import Layout from '../../../components/Layout'
import { TrackLength} from '../../../components/TrackLength'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { ViewMenu } from '../../../components/ViewMenu'
import { runState, emptyRun, trackState } from '../../../models/state'

const StartRun = () => {
  const [session, loading] = useSession()
  const [, setRun] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session || !track) { router.push('/');return <div></div> }

  async function start() {
    setRun({...emptyRun, trackId: track._id, start: new Date(), targetMarker: 1, currentLatlng: track.markers[0].latlng})
    router.push('/tracks/view')
  }


  // TODO check distance from start marker and guide to it
  return (
    <Layout menu={<ViewMenu />}>
      <div className="container flex flex-col justify-between">
        <div className="m-5">
          <h1 className="py-10">Aloita suunnistus</h1>
          <p>
            Mene lähelle ensimmäistä rastipistettä, klikkaa aloita.<br/>
            Ajanotto ja reitin seuranta käynnistyy.</p>

          <div className="flex my-5">
            <TrackLength markers={track?.markers} />
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
