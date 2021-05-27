
import { useSession } from 'next-auth/client'
import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import { Button } from '../../components/Buttons'
import { ResultList } from '../../components/ResultList'
import { resultState, runState, trackState } from '../../models/state'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'

const ResultsMenu = () => {
  const [results, setResults] = useRecoilState(resultState)
  const router = useRouter()
  const toTracks = () => {
    setResults({...results, trackRuns: []})
    router.push('/tracks')
  }
  return <div className="flex justify-end mx-6 w-full">
    <Button className="w-30" onClick={() => toTracks()}>Radat</Button>
  </div>
}

const Results = () => {
  const [results, setResults] = useRecoilState(resultState)
  const [run, setRun] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)

  const [session, loading] = useSession()
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session) { router.push('/'); return <div/> }

  useEffect(async () => {
    if (run === undefined ) {
      const res = await fetch('/api/run/track/'+track._id)
      if (res.ok) {
        const { data } = await res.json()
        setResults({...results, trackRuns: data, selected: []})
      }
      setRun(undefined) // clear run, starts looking results after run
      // should this be done in return button
    }
  }, [])

  return (
    <Layout menu={<ResultsMenu/>}>      
      <ResultList selectedRun={run}/>
    </Layout>
  )
}

export default Results