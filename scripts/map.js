var urb = [27.270139, 90.177175];
var blb = [21.168964, 85.587568];
var bounds = [blb, urb];

var map;

var popup = L.popup();
var latlng = null;
var url = null;
var address = null;


var db_data;

var myCorsApiKey = "5e9c4e0c436377171a0c25b6";
var data = null;




function loc2key(latlng) {
	// Coverts location to key for JSON
	// Expects latlng in format {'lat': xxxx, 'lng': xxxx}
	return latlng['lat'].toFixed(3) + "," + latlng['lng'].toFixed(3);	
}

function key2loc(key) {
	// Inverse of loc2key above
	latlngList = key.split(',');
	return {'lat': parseFloat(latlngList[0]), 'lng': parseFloat(latlngList[1])};
}

$(document).ready(function() {

var minZoom = 6;
if (window.innerWidth < 672) {
	map = L.map('mapid').setView([24.4, 88], 6);
}
else {
	map = L.map('mapid').setView([24.4, 88], 7);
	minZoom = 7;
}

L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png  ', {
    			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    			maxZoom: 18,
    			minZoom: minZoom,
    			tileSize: 256,
    			zoomOffset: 0,
			}).addTo(map);
map.setMaxBounds(bounds);

var xhr = new XMLHttpRequest();
//xhr.withCredentials = true;

xhr.open("GET", "https://qsynmap-6433.restdb.io/rest/map-data");
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("x-apikey", myCorsApiKey);
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    db_data = JSON.parse(this.responseText);
    console.log('data feched');
    place_markers(db_data);
  }
});

function place_markers(db_data){
	console.log('placing markers');
	for (var i in db_data) {
		obj = db_data[i];
		if (obj['verified']) {
			var db_latlng = {'lat': obj['lat'], 'lng': obj['lng']};
			console.log(db_latlng);
			var m = L.marker(db_latlng).addTo(map);
			var l1 = "<strong>Area:</strong><br>" + obj['addr'] + "<br>";
			var l2 = "<strong>Information:</strong><br>" + obj['info'] + "<br>";

			m.bindPopup(l1 + l2);
		}

	}
	console.log('marker placed');
}

/*
var loc = document.getElementById('locate');

loc.onclick =function() {
	console.log('locate() called');
    if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(pos) {
    		console.log('pos found');
    		latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
    		document.getElementById('loc-found').innerHTML = "Location: " + pos.coords.latitude.toFixed(3)  + ", " + pos.coords.longitude.toFixed(3);
    	});
	}
};
*/

function onMapClick(e) {
	console.log(e.latlng);
	

	var container = $("<u><a href=\"#report\" style=\"color:red;\">Report</a></u>");
	var tagtxt = 'Location: ' + e.latlng['lat'].toFixed(3) + ", " + e.latlng['lng'].toFixed(3);
	container.on('click', function() {
		document.getElementById('loc-found').innerHTML = tagtxt;
		latlng = e.latlng;
		//document.getElementById('locate').setAttribute('disabled', 'True');
	});

    popup
        .setLatLng(e.latlng)
        .setContent(container[0])
        .openOn(map);
}


map.on('click', onMapClick);

document.getElementById('report-but').onclick = function() {

	console.log(latlng);

	if (latlng === null) {
		alert('Please zoom into the location reported, click on the map, and click on \"Report\"');
		return;
	}

	var info_html = document.getElementById('info').value.replace("\n", "<br>");
	var addr_html = document.getElementById('addr').value.replace("\n", "<br>");

	var key = loc2key(latlng);
	var data = {
		'key': key,
		'name': document.getElementById('name').value,
		'email': document.getElementById('email').value,
		'phone': document.getElementById('phone').value,
		'info': info_html,
		'addr': addr_html,
		'lat': latlng['lat'],
		'lng': latlng['lng'],
		'verified': false,
	}

	console.log(data);

	xhr = new XMLHttpRequest();

	xhr.open("POST", "https://qsynmap-6433.restdb.io/rest/map-data", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("x-apikey", myCorsApiKey);
	xhr.setRequestHeader("cache-control", "no-cache");

	console.log('writing to db');

	xhr.send(JSON.stringify(data));

	console.log('db write successful');

	document.getElementById('report-form').reset();
	document.getElementById('loc-found').innerHTML = "Zoom in to the area to be reported, in the map, and click on the map. Then click on report to get the location and continue filling the form.";
	alert('Report Submitted. A volunteer will contact you soon. Thank You!');
};

});