
import { useMap, Polyline } from 'react-leaflet'
import { PersonMarker } from './PersonMarker'
import { runState } from '../models/state'
import { useRecoilState, } from 'recoil'



const RouteLines = ({ showRouteIndex }) => {

  const map = useMap()
  const [run] = useRecoilState(runState)


  // calculate map markers in points, then return polyline endpoints as latlng
  const makeRouteLines = (routePoints) => {
    const lines = []
    routePoints.forEach((routePoint, i) => {
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
        console.log('Error at makeRouteLines()', routePoints, e)
      }
    })
    return lines
  }


  if (!run) {
    return <div/>
  }
  console.log(run.route)
  const points = run.route.filter((r, index) => index < showRouteIndex)
  console.log(JSON.stringify(points))
  const lines = makeRouteLines(points)
  console.log(JSON.stringify(lines), showRouteIndex)
  return (
    <>
      {lines.map((linePositions, index) =>
        <Polyline
          key={'lp' +index + JSON.stringify(linePositions)}
          positions={linePositions}
          pathOptions={{color:'#0023ff', weight: '6'}}
        />
      )}

      { showRouteIndex < run.route.length && 
        <PersonMarker latlng={run.route[showRouteIndex].latlng} />
      }
      </>
  )
}

export { RouteLines }
