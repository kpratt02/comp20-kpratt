var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 13, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
			runLater();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);
	
	// Update map and go there...
	map.panTo(me);
	
	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "Here I Am!"
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}
function runLater()
{
  var http = new XMLHttpRequest();
  http.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation");
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var to_send = "login=e3EaVo5o&lat=";
  to_send += 42.4067675;
  to_send += "&lng=";
  to_send += -71.12265;
  http.send(to_send);
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
    	var parsed = JSON.parse(http.responseText);
    	addMarkers(parsed);
    	
    }
}
}
function addMarkers(parsed){
	var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
	me = [myLng, myLat];
	var smallDistance = 300;
	var closeLandmark = "";
	for (i = 0; i < parsed.landmarks.length; i++) {
			var latitude = parsed.landmarks[i].geometry.coordinates[1];
			var longitude = parsed.landmarks[i].geometry.coordinates[0];
			var LatLng = {lat: latitude, lng: longitude};
			var distanceAway = [longitude, latitude];
    		LocationName = parsed.landmarks[i].properties.Location_Name;
			var infoContent = '<div id="content">' +
							'<div id="siteNotice">' + '</div>' +
							'<h1 id="firstHeading" class="firstHeading">'
							+LocationName + '</h1>'
			infoContent += "Distance from Me: ";
			var distance = haversineDistance(me, distanceAway, true);
			if (distance < smallDistance){
				smallDistance = distance;
				closeLandmark = LocationName;
			}
			infoContent += '<div id="bodyContent">' + distance +
							'</div></div>';
			var newInfoWindow = new google.maps.InfoWindow ({
				content:infoContent
			});
    		var newMarker = new google.maps.Marker({
        		position: LatLng,
        		map: map,
        		title: parsed.landmarks[i].properties.Location_Name,
        		infowindow: newInfoWindow
  			});
			google.maps.event.addListener(newMarker, 'click', function() {
				this.infowindow.open(map, this);
			});
  			newMarker.setMap(map);
   	}
   	for (i = 0; i < parsed.people.length; i++) {
   			var latitude = parsed.people[i].lat;
			var longitude = parsed.people[i].lng;
			var LatLng = {lat: latitude, lng: longitude};
			var distanceAway = [longitude, latitude];
   			var infoContent ='<div id="content">' +
							'<div id="siteNotice">' + '</div>' +
							'<h1 id="firstHeading" class="firstHeading">'+ 
							parsed.people[i].login + '</h1>';
			infoContent += "Distance from Me: ";
			var distance = haversineDistance(me, distanceAway, true);
			infoContent += '<div id="bodyContent">' + distance +
							'</div></div>';
			var newInfoWindow = new google.maps.InfoWindow ({
				content:infoContent,
			});
    		var newMarker = new google.maps.Marker({
        		position: LatLng,
        		map: map,
        		title: parsed.people[i].login,
        		infowindow: newInfoWindow,
        		icon: iconBase + 'parking_lot_maps.png'
  			});
			google.maps.event.addListener(newMarker, 'click', function() {
				this.infowindow.open(map, this);
			});
  			newMarker.setMap(map);
   	}
   	console.log(closeLandmark, smallDistance);
}
function haversineDistance(coords1, coords2, isMiles) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lon1 = coords1[0];
  var lat1 = coords1[1];

  var lon2 = coords2[0];
  var lat2 = coords2[1];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if(isMiles) d /= 1.60934;

  return d;
}