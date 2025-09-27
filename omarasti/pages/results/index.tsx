import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import { Button } from '../../components/Buttons'
import { ResultList } from '../../components/ResultList'
import { resultState, runState, trackState } from '../../models/state'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'

const ResultsMenu = () => {
  const [results, setResults] = useRecoilState(resultState)
  const [, setRun] = useRecoilState(runState)
  const router = useRouter()
  const toTracks = () => {
    setResults({ ...results, trackRuns: [] })
    setRun(undefined)
    router.push('/tracks')
  }
  return (
    <div className='flex justify-end mx-6 w-full'>
      <Button className='w-30' onClick={() => toTracks()}>
        Radat
      </Button>
    </div>
  )
}

const Results = () => {
  const [results, setResults] = useRecoilState(resultState)
  const [run] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)

  useEffect(() => {
    if (run === undefined) {
      fetch('/api/run/track/' + track._id)
        .then(async (res) => {
          const { data } = await res.json()
          const sameData = data.every((d) => results?.trackRuns.some((r) => r._id === d._id))
          if (!sameData) {
            setResults({ ...results, trackRuns: data, selected: [] })
          }
        })
        .catch((err) => console.log('Error fetching runs of track:', track))
    }
  }, [])

  return (
    <Layout menu={<ResultsMenu />}>
      <ResultList />
    </Layout>
  )
}

export default Results
