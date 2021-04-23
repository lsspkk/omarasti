
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'


// leaflet only works in browser, it needs the window variable
const Marker = dynamic(
    () => import('../components/TrackMarker').then(module => module.StartMarker),
    { ssr: false })

const TestPage = () => {
    const [session, loading] = useSession()
    const router = useRouter()
    if (loading) return <div>loading...</div>
    if (!session ) {router.push('/');return<div/>}

    const [angle, setAngle] = useState(0)

    useEffect(() => {
      setTimeout(() => setAngle((angle+5)), 100)
    }, [angle])
  
    if (typeof window === "undefined") {
        return <div/>
    }
      

  return (
    <Layout menu={<div/>}>
      <div className="container">
        <h1>Hei</h1>
          <div style={{margin:'-40px 0 0 4px'}}>
          <Marker angle={angle}/>
          </div>

          <svg>
            <g>
              <path />      
            </g>

          </svg>
        </div>
    </Layout>
  )
};

export default TestPage
