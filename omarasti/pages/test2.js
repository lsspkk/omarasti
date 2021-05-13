// visual test for panels

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/Layout'
import dynamic from 'next/dynamic'
import { SeeFinishPanel, SeeMarkerPanel, TouchMarkerPanel, InFinishPanel, ShowOrientationPanel } from '../components/Panels'
import { Button } from '../components/Buttons'



const DesignMap = dynamic(() => {
  return import('../components/DesignMap')
}, { ssr: false })

const Test2 = ({ mapUrl }) => {
  const [, loading] = useSession()
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    setTimeout(() => setAngle((angle + 5)), 100)
  }, [angle])

  const [what, setWhat] = useState('orientation')

  if (loading) return <div>loading...</div>


  const track = {
    markers: [{ latlng: { lat: 61.500721, lng: 23.805561 }, description: 'hello' }]
  }
  const location = { latlng: { lat: 61.500621, lng: 23.804561 } }
  return (
    <Layout map="true" menu={<div />}>

      <DesignMap mapUrl={mapUrl} mapCenter={[61.500721, 23.805561]} />

      { what === 'orientation' &&
        <ShowOrientationPanel />
      }

      { what === 'touch' &&
        <TouchMarkerPanel touchMarker={() => ''} track={track} markerNumber={1} />
      }
      { what === 'see' &&
        <SeeMarkerPanel location={location} marker={track.markers[0]} markerNumber={1} />
      }

      {/* { isLastMarker && !location.canTouchMarker && location.canSeeMarker && 
          <SeeFinishPanel location={location} marker={track.markers[run.targetMarker]} /> 
        }
        { isLastMarker && location.canTouchMarker && 
          <InFinishPanel finishRun={finishRun}/> 
        } */}

      <div className="fixed bottom-0 left-0 p-1 text-xs bg-white xs:ml-10 md:ml-20"
        style={{ zIndex: '1000' }}
      >
        {what !== 'orientation' && <Button onClick={() => setWhat('orientation')}>Kompassi</Button>}
        {what !== 'see' && <Button onClick={() => setWhat('see')}>Lähellä</Button>}
        {what !== 'touch' && <Button onClick={() => setWhat('touch')}>Rastilla</Button>}
      </div>

    </Layout>
  )
}

export async function getServerSideProps() {
  const mapUrl = process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default Test2