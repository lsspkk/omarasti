
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMapEvents, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MARKER_SIZE, TrackMarker } from './TrackMarker'
import { PersonMarker } from './PersonMarker'
import L from 'leaflet'

import { designModeState } from './DesignMenu'
import { trackState } from '../pages/track.js'
import { runState } from '../pages/tracks/run/start'
import { useRecoilState, } from 'recoil'


const TrackPoints = () => {
  const [mode, setMode] = useRecoilState(designModeState)
  const [track, setTrack] = useRecoilState(trackState)
  const [run, setRun] = useRecoilState(runState)
  const [lines, setLines] = useState([])

  const map = useMapEvents({
    click(e) {
      if (!track) return
      if (mode === 'add') {
        const markers = [...track.markers, { latlng: e.latlng, description: '' }]
        //console.log(markers)
        setTrack({ ...track, markers })

      }
      map.locate()
    },
    locationfound(e) {
      // use another marker for current location
      map.flyTo(e.latlng, map.getZoom())
    },
    zoomend: () => {
      // recalculate map circle-polylines when zoom ends
      setTrack({ ...track, markers: [...track.markers] })
    }
  })

  useEffect(() => {
    const newLines = track ? makeLines(track.markers, map) : []
    setLines(newLines)
  }, [track])

  if (!track) return <div />

  return (
    <>
      {track.markers.map((marker) =>
        <TrackMarker
          key={'rm-' + JSON.stringify(marker)}
          marker={marker}
          published={track.published}
        />
      )}

      {lines.map((linePositions) =>
        <Polyline
          key={'lp' + JSON.stringify(linePositions)}
          positions={linePositions}
          color='#FA923B'
        />
      )}

      { run && <PersonMarker latlng={run.currentLatlng} />}
    </>
  )
}

// calculate map markers in points, then return polyline endpoints as latlng
const makeLines = (markers, map) => {
  const lines = []
  markers.forEach((marker, i) => {
    try {
      const start = map.latLngToLayerPoint(marker.latlng)
      if ((i + 2) > markers.length) {
        return
      }
      const end = map.latLngToLayerPoint(markers[i + 1].latlng)

      const distance = L.point(start).distanceTo(L.point(end))
      if (distance < MARKER_SIZE) {
        return
      }
      const lineStart = [
        start.x + (MARKER_SIZE / 2 / distance * (end.x - start.x)),
        start.y + (MARKER_SIZE / 2 / distance * (end.y - start.y)),
      ]
      const lineEnd = [
        end.x + (MARKER_SIZE / 2 / distance * (start.x - end.x)),
        end.y + (MARKER_SIZE / 2 / distance * (start.y - end.y)),
      ]
      const s = map.layerPointToLatLng(lineStart)
      const e = map.layerPointToLatLng(lineEnd)
      lines.push([[s.lat, s.lng], [e.lat, e.lng]])
    } catch (e) {
      console.log('Error at makeLines()', markers)
    }
  })
  return lines
}

const DesignMap = ({ mapUrl, mapCenter }) => {
  if (typeof window === 'undefined') {
    return null
  }
  return (
    <MapContainer
      style={{ width: '100%', height: '80vh' }} center={mapCenter} zoom={14.5}
    >
      <TileLayer
        url={mapUrl}
        attribution='MML avoin data'
      />
      <TrackPoints />
    </MapContainer>
  )
}

export default DesignMap
