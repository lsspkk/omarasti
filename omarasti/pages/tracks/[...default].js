// pages/design.js

import { useSession } from 'next-auth/client'
import Layout from '../../components/Layout'
import {DesignMenu} from '../../components/DesignMenu'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { runState } from './run/start'
import {ViewMenu} from '../../components/ViewMenu'
import {RunMenu} from '../../components/RunMenu'
import { useRecoilState, } from 'recoil'

const DesignMap = dynamic(() => {
  return import('../../components/DesignMap')
}, { ssr: false })

const Design = ({mapUrl}) => {
  const [run, setRun] = useRecoilState(runState)
  const [session, loading] = useSession()
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session) router.push('/')

  const menu = router.pathname === "/tracks/edit" ? <DesignMenu/> : (run !== undefined ? <RunMenu/> : <ViewMenu/>)

  return (
    <Layout menu={menu}>
      <DesignMap mapUrl={mapUrl}/>
    </Layout>
  )
}

export async function getServerSideProps() {
    //const mapUrl = 'https://xn--hyty-6qa.net/omarasti/{z}/{x}/{y}.png'
  const mapUrl =  process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default Design