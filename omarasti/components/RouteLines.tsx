import React, { useEffect, useState } from 'react'
import { Polyline } from 'react-leaflet'
import { PersonMarker } from './PersonMarker'
import type { RunType } from '../models/state'
import type { PopulatedRun } from '../models/Run'
import { LatLngTuple } from 'leaflet'

interface RoutePoint {
  latlng: { lat: number; lng: number }
  timestamp: number
}

interface RouteRun {
  _id?: string
  route: RoutePoint[]
}

interface RouteLineProps {
  showRouteIndex: number
  run: RunType | PopulatedRun | RouteRun
  color: string
}

const RouteLines: React.FC<RouteLineProps> = ({ showRouteIndex, run, color }) => {
  // max 10 lines per row
  // then React.memo to prevent rerendering rows that were not changed
  const [lineRows, setLineRows] = useState<[number, number][][][]>([])

  const makeRouteLine = (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
  ): [number, number][] => {
    return [
      [start.lat, start.lng],
      [end.lat, end.lng],
    ]
  }

  useEffect(() => {
    if (run?.route && showRouteIndex >= 1 && run.route.length >= 2) {
      const lines: [number, number][][] = []
      // Build all lines from start up to current showRouteIndex
      for (let i = 1; i <= Math.min(showRouteIndex, run.route.length - 1); i++) {
        const start = run.route[i - 1].latlng as { lat: number; lng: number }
        const end = run.route[i].latlng as { lat: number; lng: number }
        const line = makeRouteLine(start, end)
        lines.push(line)
      }

      // Group lines into rows of 10 for performance
      const newLineRows = []
      for (let i = 0; i < lines.length; i += 10) {
        newLineRows.push(lines.slice(i, i + 10))
      }

      setLineRows(newLineRows)
    } else {
      setLineRows([])
    }
  }, [showRouteIndex, run?.route])

  if (!run?.route || run.route.length < 2) {
    return <div />
  }

  const personLatlng =
    run.route.length > 0 && showRouteIndex < run.route.length
      ? run.route[showRouteIndex].latlng
      : run.route[run.route.length - 1].latlng

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

interface DecaLineProps {
  linePositions: LatLngTuple[][]
  runId?: string
  color: string
  i: number
}

const DecalineMemo: React.FC<DecaLineProps> = ({ linePositions, runId, color, i }) => {
  return (
    <>
      {linePositions.map((positions, j) => (
        <Polyline key={`dlp-${i}-${j}-${runId}`} positions={positions} pathOptions={{ color, weight: 6 }} />
      ))}
    </>
  )
}

const propsAreEqual = (prevProps: DecaLineProps, nextProps: DecaLineProps): boolean => {
  return prevProps.i === nextProps.i && prevProps.linePositions.length === nextProps.linePositions.length
}
const DecaLine = React.memo(DecalineMemo, propsAreEqual)

export { RouteLines }
