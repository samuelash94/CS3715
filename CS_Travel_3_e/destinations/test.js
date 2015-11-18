window.onload = getMyLocation;

function getMyLocation(){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(displayLocation, displayError);
	}else{
		alert("Oops, no geolocation support.");
	}
}
function displayLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	var div = document.getElementById("map");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
	
	showMap(position.coords);
}
function displayError(error){
	var errorTypes = {
			0: "Unknown error",
			1: "Permission denied by user",
			2: "Position is not available",
			3: "Request timed out"
		};
	var errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2){
		errorMessage = errorMessage + " " + error.message;
	}
	var div = document.getElementById("location1");
	div.innerHTML = errorMessage;
}
var map;
function showMap(coords){
	var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);
	
	var mapOptions = {
		zoom: 10,
		center: googleLatAndLong,
		mapTypeID: google.maps.MapTypeID.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	window.map = new google.maps.Map(mapDiv, mapOptions);
}