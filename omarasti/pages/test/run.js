// visual test for panels

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { Layout } from '../../components/Layout'
import dynamic from 'next/dynamic'
import { SeeFinishPanel, SeeMarkerPanel, TouchMarkerPanel, InFinishPanel, ShowOrientationPanel } from '../../components/Panels'
import { Button } from '../../components/Buttons'



const DesignMap = dynamic(() => {
  return import('../../components/DesignMap')
}, { ssr: false })

const SlowCompass = () => {

  const makeStyle = (angle) => ({
    transformBox: 'fill-box',
    transformOrigin: '0 50%',
    transform: `rotate(${Math.round(angle)}deg)`
  })

  const alpha = 110
  const beta = 270

  let gamma = alpha // if both are same
  if (alpha > beta) {
    if ((alpha - beta) < 180) {
      // normal, just half angle less
      gamma = alpha - (alpha - beta)/2
    }
    else {
      // direction past 360 degrees
      const temp = 360 + beta - alpha
      gamma = beta - temp/2
    }
  }
  if (alpha < beta) {
    if ((beta - alpha) < 180) {
      gamma = beta - (beta - alpha)/2
    }
    else {
      const temp = 360 + alpha - beta
      gamma = temp/2 + beta
    }

  }


  return (
    <div className={`absolute left-20 mr-2 sm:mr-10 ml-2 sm:ml-20 items-start`} style={{ zIndex: '1000' }}>
      gamma = {gamma}
      <svg className="bg-white" width="100" height="100" viewBox="0 0 100 100" >
        <rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5" />

        <path d="M 50 50 H 75" stroke="black" style={makeStyle(alpha)} />
        <path d="M 50 50 H 75" stroke="red" style={makeStyle(beta)} />
        <path d="M 50 50 H 75" stroke="cyan" style={makeStyle(gamma)} />
      </svg>
    </div>)
}



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

      <SlowCompass />

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

        <Button onClick={() => {
            setMessage('Hello')
            window.setTimeout(()=>setMessage(''))
          }}>Hello</Button>
          <Link href="/">Bye</Link>
          <Button><Link href="/">Bye Bye</Link></Button>
          <Link href="/"><Button>Bye3</Button></Link>
      </div>

    </Layout>
  )
}

export async function getServerSideProps() {
  const mapUrl = process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default Test2