import { totalDistance } from '../utils/location'


export const TrackLength = ({markers}) => {

    const length = totalDistance(markers)

    return (
        <>
        <label className="w-20 p-0">Pituus: </label>
        <div className="pr-4 inline-block">{length}m</div>
        </>
    )
}
    