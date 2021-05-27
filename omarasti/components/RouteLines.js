import { useEffect, useState } from 'react'
import { useMap, Polyline } from 'react-leaflet'
import { PersonMarker } from './PersonMarker'

const RouteLines = ({ showRouteIndex, run, color }) => {

  const [shownLines, setShownLines] = useState([])
  const map = useMap()

  if (!run) {
    return <div />
  }



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

  const makeRouteLine = (routePoints) => {
    try {
      const start = map.latLngToLayerPoint(routePoints[0].latlng)
      const end = map.latLngToLayerPoint(routePoints[1].latlng)

      const s = map.layerPointToLatLng(start)
      const e = map.layerPointToLatLng(end)
      return [[s.lat, s.lng], [e.lat, e.lng]]
    } catch (e) {
      console.log('Error at makeRouteLines()', routePoints, e)
    }
    return undefined
  }

  // useEffect(() => {
  // console.log(showRouteIndex)
  // if (showRouteIndex > 0 && showRouteIndex < run.route.length) {
  //   const points = run.route.slice(showRouteIndex - 1, showRouteIndex)
  //   const lines = makeRouteLine(points)
  //   if (lines) setShownLines([...shownLines, lines])
  // }
  // }, [showRouteIndex])

  const personLatlng = showRouteIndex < run.route.length ?
    run.route[showRouteIndex].latlng
    : run.route[run.route.length - 1].latlng


  const max = showRouteIndex < (run.route.length) ? showRouteIndex: run.route.length
  const lines = makeRouteLines(run.route.slice(0, max))
  return (
    <>
      {lines.map((linePositions, i) =>
        <Polyline
          key={`lp${i}-${run._id}`}
          positions={linePositions}
          pathOptions={{ color, weight: '6' }}
        />
      )}

      { showRouteIndex < run.route.length && <PersonMarker latlng={personLatlng} color={color} />}
    </>
  )
}

export { RouteLines }
