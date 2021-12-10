import React, { useEffect, useState } from 'react'
import { Polyline } from 'react-leaflet'
import { PersonMarker } from './PersonMarker'

const RouteLines = ({ showRouteIndex, run, color }) => {
  // max 10 lines per row
  // then React.memo to prevent rerendering rows that were not changed
  const [lineRows, setLineRows] = useState([])

  if (!run) {
    return <div />
  }

  const makeRouteLine = (start, end) => {
    return [
      [start.lat, start.lng],
      [end.lat, end.lng],
    ]
  }

  useEffect(() => {
    if (showRouteIndex > 1 && showRouteIndex < run.route.length) {
      const start = run.route[showRouteIndex - 1].latlng
      const end = run.route[showRouteIndex].latlng
      const line = makeRouteLine(start, end)
      if (lineRows.length > 0) {
        const row = lineRows.length - 1
        const column = lineRows[row].length - 1

        const last = lineRows[row][column]
        if (
          last[0][0] !== line[0][0] ||
          last[0][1] !== line[0][1] ||
          last[1][0] !== line[1][0] ||
          last[1][1] !== line[1][1]
        ) {
          const isFull = column === 9

          setLineRows((prev) => {
            const newLines = [...prev]
            if (isFull) {
              newLines.push([line])
            } else {
              newLines[row].push(line)
            }
            return newLines
          })
        }
      } else {
        setLineRows([[line]])
      }
    }
  }, [showRouteIndex])

  const personLatlng =
    showRouteIndex < run.route.length ? run.route[showRouteIndex].latlng : run.route[run.route.length - 1].latlng

  const runId = run._id
  return (
    <>
      {lineRows.map((linePositions, i) => (
        <DecaLine key={`lp-${i}-${runId}-${linePositions.length}`} {...{ linePositions, runId, color, i }} />
      ))}

      {showRouteIndex < run.route.length && <PersonMarker latlng={personLatlng} color={color} />}
    </>
  )
}

const DecalineMemo = ({ linePositions, runId, color, i }) => {
  return (
    <>
      {linePositions.map((positions, j) => (
        <Polyline key={`dlp-${i}-${j}-${runId}`} positions={positions} pathOptions={{ color, weight: '6' }} />
      ))}
    </>
  )
}
const propsAreEqual = (prevProps, nextProps) => {
  return prevProps.i === nextProps.i && prevProps.linePositions.length === nextProps.linePositions.length
}
const DecaLine = React.memo(DecalineMemo, propsAreEqual)

export { RouteLines }
