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

// real geolocation, or fake some value
async function getLocation(targetLatLng, previousLatLng) {
    
    try {
        const position = await getCoordinates()
        return { lat: position.coords.latitude, lng: position.coords.longitude }
    } catch (error) {
        console.log('No location:', error)      
    }
    const fake = fakeLocation(targetLatLng, previousLatLng)
    console.log('fakelocation:', fake)
    return fake
}


// fake halfway towards targetLatLng
function fakeLocation(targetLatLng, previousLatLng) {
    if (!previousLatLng) return targetLatLng

    const lat1 = targetLatLng.lat
    const lon1 = targetLatLng.lng
    const lat2 = previousLatLng.lat
    const lon2 = previousLatLng.lng
    const halfway = { lat: lat1+(lat2-lat1)/1, lng: lon1+(lon2-lon1)/2}

    const d = distanceInMeters(lat1, lon1, lat2, lon2)

    return d < 50 ? targetLatLng : halfway
}



function distanceInMeters(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist * 1.609344 *1000
	}
}

export { getLocation }