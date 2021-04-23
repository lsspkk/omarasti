import { atom } from 'recoil'

const runState = atom({ key: 'runState', default: undefined })

const emptyRun = { 
  totalTime: -1,
  start: undefined, 
  end: undefined, 
  route: [], 
  markerTimes: [], 
  targetMarker: -1, 
  trackId: undefined,
  currentLatlng: undefined,
  showPersonMarker: false,
  routeMarkTime : undefined
 }


 const trackState = atom({ key: 'trackState', default: undefined })
  // see Track.js for data model


 export { runState, emptyRun, trackState }