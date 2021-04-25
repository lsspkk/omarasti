
import { useMap, Polyline } from 'react-leaflet'
import { PersonMarker } from './PersonMarker'
import { runState } from '../models/state'
import { useRecoilState, } from 'recoil'


// calculate map markers in points, then return polyline endpoints as latlng
const makeRouteLines = (routePoints, map) => {
  const lines = []
  markers.forEach((routePoint, i) => {
    try {
      const start = map.latLngToLayerPoint(routePoint.latlng)
      if ((i + 2) > routePoints.length) {
        return
      }
      const end = map.latLngToLayerPoint(routePoints[i + 1].latlng)

      const s = map.layerPointToLatLng(start)
      const e = map.layerPointToLatLng(end)
      lines.push([[s.lat, s.lng], [e.lat, e.lng]])
    } catch (e) {
      console.log('Error at makeRouteLines()', routePoints)
    }
  })
  return lines
}

const RouteLines = ({ showRouteIndex }) => {

  const map = useMap()
  const [run] = useRecoilState(runState)

  if (!run) {
    return <div/>
  }
  const routePoints = run.route.filter((r, index)=> index < showRouteIndex).map(r => r.latlng)
  const lines = makeRouteLines(routePoints, map)

  return (
    <>
      {lines.map((linePositions) =>
        <Polyline
          key={'lp' + JSON.stringify(linePositions)}
          positions={linePositions}
          color='#0022ff'
        />
      )}

      <PersonMarker latlng={run.route[showRouteIndex].latlng} />
      </>
  )
}

export { RouteLines }
