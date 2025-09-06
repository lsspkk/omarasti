import { Layout } from '../../../components/Layout'
import { TrackDistance } from '../../../components/Distance'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { ViewMenu } from '../../../components/ViewMenu'
import { runState, emptyRun, trackState } from '../../../models/state'
import { useState } from 'react'
import Checkbox from '../../../components/Checkbox'

const StartRun = () => {
  const [, setRun] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)
  const [showPersonMarker, setShowPersonMarker] = useState(false)
  const router = useRouter()

  async function start() {
    setRun({
      ...emptyRun,
      track: track._id,
      start: new Date(),
      targetMarker: 1,
      currentLatlng: track.markers[0].latlng,
      showPersonMarker,
    })
    router.push('/tracks/view')
  }

  // TODO check distance from start marker and guide to it
  return (
    <Layout menu={<ViewMenu />}>
      <div className='container flex flex-col justify-between'>
        <div className='m-5'>
          <h1 className='py-10'>Aloita suunnistus</h1>
          <p>
            Mene lähelle ensimmäistä rastipistettä, klikkaa aloita.
            <br />
            Ajanotto ja reitin seuranta käynnistyy.
          </p>

          <div className='flex my-5'>
            <TrackDistance markers={track?.markers} />
          </div>
          <div className='flex my-5'>
            <Checkbox
              id='show-person-marker'
              checked={showPersonMarker}
              onChange={() => setShowPersonMarker(!showPersonMarker)}
              className='checked:bg-blue-600 checked:border-transparent'
              label='Näytä sijainti'
            />
          </div>
        </div>
      </div>
      <div className='select-none container flex justify-center'>
        <Button variant='green' className='m-8 p-2' onClick={() => start()}>
          Aloita Suunnistus
        </Button>
      </div>
    </Layout>
  )
}

export default StartRun
