import { totalDistance } from '../utils/location'


export const TrackLength = ({markers}) => {

    const length = totalDistance(markers)

    return (
        <>
        <label className="w-20 p-0">Pituus:</label>
        <div className="w-40">{length}m</div>
        </>
    )
}
    