import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMapEvents, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MARKER_SIZE, TrackMarker } from './TrackMarker'
import { PersonMarker } from './PersonMarker'
import L from 'leaflet'
import type { LatLngTuple } from 'leaflet'

import { designModeState } from './DesignMenu'
import { runState, trackState, resultState, routeColors } from '../models/state'
import { useRecoilState } from 'recoil'
import { angleInDegrees } from '../utils/location'
import { RouteLines } from './RouteLines'
import { isWindow } from '../utils/browser'

const TrackPoints = () => {
  const [mode] = useRecoilState(designModeState)
  const [track, setTrack] = useRecoilState(trackState)
  const [lines, setLines] = useState([])

  const map = useMapEvents({
    click(e) {
      if (!track) return
      if (mode === 'add') {
        const markers = [...track.markers, { latlng: e.latlng, description: '', visibility: 50 }]
        // console.log(markers)
        setTrack({ ...track, markers })
      }
      // map.locate()
    },
    locationfound(e) {
      // use another marker for current location
      map.flyTo(e.latlng, map.getZoom())
    },
    zoomend: () => {
      // recalculate map circle-polylines when zoom ends
      setTrack({ ...track, markers: [...track.markers] })
    },
  })

  useEffect(() => {
    const newLines = track ? makeLines(track.markers, map) : []
    setLines(newLines)
  }, [track])

  if (!track) return <div />

  return (
    <>
      {track.markers.map((marker, index) => (
        <TrackMarker
          key={'rm-' + JSON.stringify(marker)}
          marker={marker}
          published={track.published}
          index={index}
          isLastMarker={index === track.markers.length - 1}
          angle={index !== 0 || track.markers.length < 2 ? 0 : angleInDegrees(marker.latlng, track.markers[1].latlng)}
        />
      ))}

      {lines.map((linePositions) => (
        <Polyline
          key={'lp' + JSON.stringify(linePositions)}
          positions={linePositions}
          pathOptions={{ color: '#fa4362', weight: 5 }}
        />
      ))}
    </>
  )
}

// calculate map markers in points, then return polyline endpoints as latlng
const makeLines = (markers: any[], map: any): LatLngTuple[][] => {
  const lines: LatLngTuple[][] = []
  markers.forEach((marker, i) => {
    try {
      const start = map.latLngToLayerPoint(marker.latlng)
      if (i + 2 > markers.length) {
        return
      }
      const end = map.latLngToLayerPoint(markers[i + 1].latlng)

      const distance = L.point(start).distanceTo(L.point(end))
      if (distance < MARKER_SIZE) {
        return
      }
      const lineStart = [
        start.x + (MARKER_SIZE / 2 / distance) * (end.x - start.x),
        start.y + (MARKER_SIZE / 2 / distance) * (end.y - start.y),
      ]
      const lineEnd = [
        end.x + (MARKER_SIZE / 2 / distance) * (start.x - end.x),
        end.y + (MARKER_SIZE / 2 / distance) * (start.y - end.y),
      ]
      const s = map.layerPointToLatLng(lineStart)
      const e = map.layerPointToLatLng(lineEnd)
      lines.push([
        [s.lat, s.lng],
        [e.lat, e.lng],
      ])
    } catch (e) {
      console.log('Error at makeLines()', markers)
    }
  })
  return lines
}

// when Track loads
function Recenter({ center, zoom }: { center: L.LatLngExpression; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom) // or map.flyTo(center, zoom)
    }
  }, [map, center?.[0], center?.[1], zoom])
  return null
}

const DesignMap = ({
  mapUrl,
  mapCenter,
  showRoute = false,
  showRouteIndex,
}: {
  mapUrl: string
  mapCenter: L.LatLngExpression
  showRoute?: boolean // true when showing route for one run
  showRouteIndex?: number // index of the route point to show
}) => {
  const [run] = useRecoilState(runState)
  const [results] = useRecoilState(resultState)

  if (!isWindow()) {
    return null
  }

  let runs = undefined
  if (results?.selected?.length > 1) {
    runs = results.selected
  }

  const minZoom = process.env.NEXT_PUBLIC_MINZOOM ? Number(process.env.NEXT_PUBLIC_MINZOOM) : undefined
  const maxZoom = process.env.NEXT_PUBLIC_MAXZOOM ? Number(process.env.NEXT_PUBLIC_MAXZOOM) : undefined
  const attribution = process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? ''

  return (
    <MapContainer
      style={{ width: '100%', height: '90vh' }}
      center={mapCenter}
      zoom={14.5}
      minZoom={minZoom}
      maxZoom={maxZoom}
    >
      <Recenter center={mapCenter} zoom={14.5} />
      <TileLayer url={mapUrl} attribution={attribution} />
      <TrackPoints />

      {/* When running, if person markers was checked, show it */}
      {!showRoute && run && run?.showPersonMarker && <PersonMarker latlng={run.currentLatlng} />}

      {/* When showing route for one run, show the route */}
      {showRoute && runs === undefined && <RouteLines showRouteIndex={showRouteIndex} run={run} color='blue' />}

      {/* When showing route for multiple runs, show the route for each run */}
      {showRoute &&
        runs !== undefined &&
        runs.map((runResult, i) => (
          <RouteLines
            key={`routelines${runResult._id}`}
            showRouteIndex={showRouteIndex}
            run={runResult}
            color={routeColors[i % routeColors.length]}
          />
        ))}
    </MapContainer>
  )
}

export default DesignMap
