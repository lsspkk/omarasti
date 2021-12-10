import { atom } from 'recoil'

const runState = atom({ key: 'runState', default: undefined })

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
  routeMarkTime : undefined
 }


 const trackState = atom({ key: 'trackState', default: undefined })
  // see Track.js for data model



const emptyResults = {
  trackRuns: [],
  selectedRuns: []
}
const resultState = atom({ key: 'resultState', default: emptyResults })


const routeColors = ['#3B32AB', 'red', 'green', 'chucknorris', 'cyan', 'magenta', 'orange', 'plum']


 export { runState, emptyRun, trackState, resultState, emptyResults, routeColors }