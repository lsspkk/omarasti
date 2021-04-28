
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}

function getCoordinates() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  })
}

const simulateLocation = process.env.NEXT_PUBLIC_SIMULATE_LOCATION === 'true'

// real geolocation, or simulated: 10 meters towards target
async function getLocation(targetLatLng, previousLatLng) {

  if (simulateLocation) {
    return simulateGetLocation(targetLatLng, previousLatLng)
  }
  
  try {
    const position = await getCoordinates()
    return { lat: position.coords.latitude, lng: position.coords.longitude }
  } catch (error) {
    console.log('No location:', error)
  }
  return previousLatLng
}

function simulateGetLocation(targetLatLng, previousLatLng) {
  if (!previousLatLng) return targetLatLng

  const lat1 = targetLatLng.lat
  const lng1 = targetLatLng.lng
  const lat2 = previousLatLng.lat
  const lng2 = previousLatLng.lng

  const dlat = lat1 - lat2
  const dlng = lng1 - lng2
  const distance = Math.sqrt(dlat * dlat + dlng * dlng)
  if (distance < 0.0005) { // about 100m
    return targetLatLng
  }
  const angle = Math.atan2(dlat, dlng)
  const newLat = lat2 + Math.sin(angle) * 0.0001 + (Math.random()*0.0002-0.0001)
  const newLon = lng2 + Math.cos(angle) * 0.0001 + (Math.random()*0.0002-0.0001)
  return { lat: newLat, lng: newLon }
}

function distance(latlng1, latlng2) {
  const lat1 = latlng1.lat
  const lng1 = latlng1.lng
  const lat2 = latlng2.lat
  const lng2 = latlng2.lng
  return distanceInMeters(lat1, lng1, lat2, lng2)
}

function distanceInMeters(lat1, lng1, lat2, lng2) {
  if ((lat1 == lat2) && (lng1 == lng2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lng1 - lng2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist * 1.609344 * 1000
  }
}

function totalDistance(markers) {
  const latLngs = !markers ? [] : markers.map(m => m.latlng)
  let dist = 0
  for (let i = 0; i + 1 < latLngs.length; i++) {
    dist += distance(latLngs[i], latLngs[i + 1])
  }
  return Math.trunc(dist)
}

function angleInDegrees(latlng1, latlng2) {
  const dlat = latlng2.lat - latlng1.lat
  const dlng = latlng2.lng - latlng1.lng

  if (dlat === 0) return dlng > 0 ? 90 : 270
  var theta = Math.atan2(dlat, dlng); // range (-PI, PI]
  theta = theta * 180 / Math.PI; // to degrees
  theta = -1 * theta + 90 // North is Zero, bearing to counterclockwise
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}


export { angleInDegrees, distance, getLocation, totalDistance }