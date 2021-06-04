import { useEffect, useState } from 'react'
import { useMap, Polyline } from 'react-leaflet'
import { PersonMarker } from './PersonMarker'

const RouteLines = ({ showRouteIndex, run, color }) => {

  const [shownLines, setShownLines] = useState([])
  const map = useMap()

  if (!run) {
    return <div />
  }



  const makeRouteLine = (start, end) => {
    return [[start.lat, start.lng], [end.lat, end.lng]]
  }

  useEffect(() => {
    if (showRouteIndex > 1 && showRouteIndex < run.route.length) {
      const start = run.route[showRouteIndex-1].latlng
      const end = run.route[showRouteIndex].latlng
      const line = makeRouteLine(start, end)
      if (shownLines.length > 0) {
        const last = shownLines[shownLines.length - 1]
        if (last[0][0] !== line[0][0] ||
          last[0][1] !== line[0][1] ||
          last[1][0] !== line[1][0] ||
          last[1][1] !== line[1][1]) {
          setShownLines([...shownLines, line])
        }
      }
      else {
        setShownLines([...shownLines, line])
      }

    }
  }, [showRouteIndex])

  const personLatlng = showRouteIndex < run.route.length ?
    run.route[showRouteIndex].latlng
    : run.route[run.route.length - 1].latlng


  //const max = showRouteIndex < (run.route.length) ? showRouteIndex: run.route.length
  //const lines = makeRouteLines(run.route.slice(0, max))
  return (
    <>
      {shownLines.map((linePositions, i) =>
        <Polyline
          key={`lp-${i}-${JSON.stringify(linePositions)}-${run._id}`}
          positions={linePositions}
          pathOptions={{ color, weight: '6' }}
        />
      )}

      { showRouteIndex < run.route.length && <PersonMarker latlng={personLatlng} color={color} />}
    </>
  )
}

export { RouteLines }
