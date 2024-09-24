import { useSession } from 'next-auth/react'
import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import { Button } from '../../components/Buttons'
import { TrackList } from '../../components/TrackList'
import { trackState } from '../../models/state'
import { useRecoilState } from 'recoil'
import { getTracks } from '../api/tracks'
import { designModeState } from '../../components/DesignMenu'
import dbConnect from '../../utils/dbConnect'

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
  return (
    <div className='flex justify-between w-full'>
      <h1 className='ml-4'>Radat</h1>

      <Button className='mr-4 w-30' onClick={() => createNewTrack()}>
        Uusi Rata
      </Button>
    </div>
  )
}

const Tracks = ({ tracks }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status === 'loading') return <div>loading...</div>
  if (!session) router.push('/')

  return (
    <Layout menu={<TracksMenu />}>
      <TrackList tracks={tracks} />
    </Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  await dbConnect()
  const result = await getTracks(req, res)
  const tracks = JSON.parse(JSON.stringify(result.data))
  return { props: { tracks } }
}

export default Tracks
