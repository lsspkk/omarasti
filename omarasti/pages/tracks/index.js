
import { useSession } from 'next-auth/client'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { Button } from '../../components/Buttons'
import TrackList from '../../components/TrackList'
import { trackState } from '../track'
import { useRecoilState } from 'recoil'
import { getTracks } from '../api/tracks'
import { designModeState } from '../../components/DesignMenu'
import dbConnect from '../../utils/dbConnect'
import { useEffect } from 'react'

const TracksMenu = () => {
  const [, setMode] = useRecoilState(designModeState)
  const router = useRouter()
  const [, setTrack] = useRecoilState(trackState)
  const createNewTrack = () => {
    const newTrack = {
      name: '',
      location: '',
      owner: '',
      modified: '',
      markers: [],
      published: false,
    }
    setMode('add')
    setTrack(newTrack)
    router.push('/tracks/edit')
  }
  return <div className="flex justify-between mx-6 w-full">
    <h1>Radat</h1>

    <Button className="w-30" onClick={() => createNewTrack()}>Uusi Rata</Button>
  </div>
}

const Tracks = ({tracks}) => {
  const [, setMode] = useRecoilState(designModeState)
  const [session, loading] = useSession()
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session) router.push('/')


  return (
    <Layout menu={<TracksMenu/>}>
      
      <TrackList tracks={tracks}/>
    </Layout>
  )
};


export async function getServerSideProps({req}) {
  await dbConnect()
  const result = await getTracks(req)
  const tracks = JSON.parse(JSON.stringify(result.data))
  return { props: { tracks } }
}

export default Tracks