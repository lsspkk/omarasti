
import { useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { ViewMenu } from '../../../components/ViewMenu'
import { trackState } from '../../track'
import { getLocation } from '../../../utils/location'
import { atom } from 'recoil'

const runState = atom({ key: 'runState', default: undefined })

const StartRun = () => {
  const [session, loading] = useSession()
  const [, setRun] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session || !track) router.push('/')

  useEffect(() => {
    if (track !== undefined) {
      console.log('lataa radan pituus näkyviin')
    }
  }, [track])


  async function start() {
    let latlng = await getLocation(track.markers[0].latlng)
    setRun({ start: new Date(), end: undefined, currentLatlng: latlng, route: [], markers: [], currentMarker: 0, trackId: track._id })
    router.push('/tracks/view')
  }

  // TODO check if on marker one
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
            <div className="w-40">{track?.length}</div>
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