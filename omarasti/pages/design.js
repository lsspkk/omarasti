// pages/profile.js

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/Layout'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(() => {
  return import('react-leaflet').then(module => module.MapContainer)
}, { ssr: false })
const TileLayer = dynamic(() => {
  return import('react-leaflet').then(module => module.TileLayer)
}, { ssr: false })

const Profile = () => {
  const [session, loading] = useSession()

  // leaflet requires window, so Server Side Rendering is not possible
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => {
    setIsBrowser(true)
    console.log('is mounted')
  }, [])
  if (!isBrowser) {
    return null
  }

  if (loading) return <div>loading...</div>
  if (!session) return <div>no session</div>
  if (typeof window === 'undefined') {
    return null
  }
  return (
    <Layout>
      <p>Hi</p>
      <MapContainer className='w-full h-full' style={{ width: '100%', height: '80vh' }} center={[52.12076638441093, 2.982406743276816]} zoom={14.5}>
        <TileLayer
          url={process.env.TAMPERE_MAP_URL}
          attribution='Generated by TilesXYZ'
        />

      </MapContainer>
    </Layout>
  )
}

export default Profile
