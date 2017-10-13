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
function addMarkers(parsedText)
{
    for (i = 0; i < parsedText.landmarks.length; i++){
    	var LatLng = {lat: parsedText.landmarks[i].geometry.coordinates[0],
    		lng: parsedText.landmarks[i].geometry.coordinates[1]};
    		newMarker = new google.maps.Marker({
        	position: LatLng,
        	map: map,
        	title: "hello world!",
  	});
  	newMarker.setMap(map);
}
}