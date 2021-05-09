import { totalDistance } from '../utils/location'


const TrackDistance = ({markers}) => {

    const length = totalDistance(markers)

    return (
        <>
        <label className="w-20 p-0">Pituus: </label>
        <div className="pr-4 inline-block">{length}m</div>
        </>
    )
}


const RunDistance = ({route}) => {

    const length = totalDistance(route)

    return (
        <>
        <label className="w-20 p-0">Reitti: </label>
        <div className="pr-4 inline-block">{length}m</div>
        </>
    )
}


export { TrackDistance, RunDistance }