// pages/design.js

import { useSession } from 'next-auth/client'
import Layout from '../components/Layout'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'

const DesignMap = dynamic(() => {
  return import('../components/DesignMap')
}, { ssr: false })

const Design = () => {
  const [session, loading] = useSession()

  if (loading) return <div>loading...</div>
  if (!session) return <div>no session</div>
  return (
    <Layout>
      <DesignMap />
    </Layout>
  )
}

export default Design
