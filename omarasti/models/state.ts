import { atom } from 'recoil'
import { TrackPopulatedType } from './Track'
import L from 'leaflet'
import { PopulatedRun } from './Run'

const runState = atom<RunType | undefined>({ key: 'runState', default: undefined })

// Type, when running
export type RunType = {
  _id?: string
  totalTime: number
  start: Date | undefined
  end: Date | undefined
  route: { latlng: L.LatLngExpression; timestamp: number }[]
  markerTimes: Date[]
  targetMarker: number
  track: string | TrackPopulatedType | undefined
  runner: string | undefined
  currentLatlng: { lat: number; lng: number } | undefined
  showPersonMarker: boolean
  routeMarkTime?: number // timestamp when the last route point was marked
}

const emptyRun = {
  totalTime: -1,
  start: undefined,
  end: undefined,
  route: [],
  markerTimes: [],
  targetMarker: -1,
  track: undefined,
  runner: undefined,
  currentLatlng: undefined,
  showPersonMarker: false,
  routeMarkTime: undefined,
}

const trackState = atom<TrackPopulatedType | undefined>({ key: 'trackState', default: undefined })

const emptyResults: ResultType = {
  trackRuns: [],
  selected: [],
}

export type ResultType = {
  trackRuns: PopulatedRun[] // all
  selected: (PopulatedRun & { place: number })[] // selected to be shown
}

const resultState = atom<ResultType>({ key: 'resultState', default: emptyResults })

const routeColors = ['#3B32AB', 'red', 'green', 'chucknorris', 'cyan', 'magenta', 'orange', 'plum']

export { runState, emptyRun, trackState, resultState, emptyResults, routeColors }
