import { totalDistance } from '../utils/location'

const distance = (markers) => {
  const length = totalDistance(markers)
  return length < 1000 ? `${length}m` : `${(length / 1000).toFixed(1)}km`
}
const TrackDistance = ({ markers, className }: { markers: any; className?: string }) => {
  return (
    <>
      <label htmlFor='track-distance' className={`w-20 p-0 ${className}`}>
        Pituus:{' '}
      </label>
      <div id='track-distance' className='pr-4 inline-block'>
        {distance(markers)}
      </div>
    </>
  )
}

const RunDistance = ({ route, className }: { route: any; className?: string }) => {
  return (
    <>
      <label htmlFor='run-distance' className={`w-20 p-0 ${className}`}>
        Oma reitti:{' '}
      </label>
      <div id='run-distance' className='pr-4 inline-block'>
        {distance(route)}
      </div>
    </>
  )
}

export { TrackDistance, RunDistance, distance }
