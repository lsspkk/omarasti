
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { Button } from '../../components/Buttons'
import TrackList from '../../components/TrackList'
import { trackState } from '../track'
import { useRecoilState } from 'recoil'
import { getTracks } from '../api/tracks'
import { designModeState } from '../../components/DesignMenu'
import dbConnect from '../../utils/dbConnect'

const TracksMenu = () => {
  return <>
    <Link href="track"><Button>Rata</Button></Link>
    <Link href="design"><Button>Rastit</Button></Link>
  </>
}

const Tracks = ({tracks}) => {
  const [, setMode] = useRecoilState(designModeState)
  const [track, setTrack] = useRecoilState(trackState)
  const [session, loading] = useSession()
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session) router.push('/')

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

  //console.log("tracks", tracks)
  const trackMenu = track === undefined ?  (<div></div>) : (<TracksMenu/>)

  return (
    <Layout menu={trackMenu}>
      <Button className="w-30" onClick={() => createNewTrack()}>Uusi</Button>
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