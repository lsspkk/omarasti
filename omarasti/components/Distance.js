import { totalDistance } from '../utils/location'

const distance = (markers) => {
  const length = totalDistance(markers)
  return length < 1000 ? `${length}m` : `${(length / 1000).toFixed(1)}km`
}
const TrackDistance = ({ markers, className }) => {
  return (
    <>
      <label className={`w-20 p-0 ${className}`}>Pituus: </label>
      <div className='pr-4 inline-block'>{distance(markers)}</div>
    </>
  )
}

const RunDistance = ({ route, className }) => {
  return (
    <>
      <label className={`w-20 p-0 ${className}`}>Oma reitti: </label>
      <div className='pr-4 inline-block'>{distance(route)}</div>
    </>
  )
}

export { TrackDistance, RunDistance, distance }
