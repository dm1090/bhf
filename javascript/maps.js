var map, heatmap;
var markers = [];
var persons = [
    /* Name, Lat, Long, Weight, Sequence Num */
    ['Saurav B', 12.927, 77.647, 1.0],
    ['Gaurav DG', 28.564, 77.191, 1.0],
    ['Shinjini BDG', 28.567, 77.229, 1.0],
    ['Subhrangshu G', 22.512, 88.417, 1.0],
    ['Saibal M', 22.594, 88.418, 1.0],
    ['Malabika M', 37.675, -121.899, 1.0],
    ['Somnath M', 37.669, -121.899, 1.0],
    ['Suhas B', 28.532, 77.296, 1.0],
    ['Samita B', 28.533, 77.295, 1.0],
    ['Jayanta G', 34.206, -118.635, 1.0],
    ['Sarmila G', 34.204, -118.643, 1.0]
];

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearPersons() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showPersons() {
    setMapOnAll(map);
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 50);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
    return [
        new google.maps.LatLng(37.782551, -122.445368),
        new google.maps.LatLng(37.782745, -122.444586),
	{location: new google.maps.LatLng(22.321, 87.310), weight: 1},
	{location: new google.maps.LatLng(36.099365, -115.173028), weight: 2},
	{location: new google.maps.LatLng(34.101561, -118.338319), weight: 15}
    ];
}

function drawCenterOfMass(name, lat, lng, color) {
    var infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    marker = new google.maps.Marker({
	position: new google.maps.LatLng(lat, lng),
	map: map,
	icon: {
	    url: "http://maps.google.com/mapfiles/ms/icons/" + color + "-dot.png"
	}
    });

    //  bounds.extend(marker.position);

    google.maps.event.addListener(marker, 'click', (function(marker) {
	return function() {
	    infowindow.setContent(name);
	    infowindow.open(map, marker);
	}
    })(marker));
}

function initialize() {

    var centerOfMassLocus = [
	{lat: 0.0, lng: 0.0},
	{lat: 0.0, lng: -90.0},
	{lat: 0.0, lng: -180.0},
	{lat: 0.0, lng: 90.0},
	{lat: 0.0, lng: 0.0}
    ];
    var center = [0, 0];
    var totalweight = 0;

    window.map = new google.maps.Map(document.getElementById('map'), {
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	streetViewControl: false,
	scaleControl: true
    });

    var infowindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();

    for (i = 0; i < persons.length; i++) {
	marker = new google.maps.Marker({
	    position: new google.maps.LatLng(persons[i][1], persons[i][2]),
	    map: map
	});

	center[0] += persons[i][1] * persons[i][3];
	center[1] += persons[i][2] * persons[i][3];
	totalweight += persons[i][3];

	bounds.extend(marker.position);

	google.maps.event.addListener(marker, 'click', (function(marker, i) {
	    return function() {
		infowindow.setContent(persons[i][0]);
		infowindow.open(map, marker);
	    }
	})(marker, i));
	markers.push(marker);
    }

    center[0] /= totalweight;
    center[1] /= totalweight;

    drawCenterOfMass('Center of Mass Prime', center[0], center[1], 'blue');
    drawCenterOfMass('Center of Mass 180', center[0], center[1]+180, 'pink');

    for (i = 0; i < centerOfMassLocus.length; i++) {
	centerOfMassLocus[i].lat = center[0];
    }
    var locus = new google.maps.Polyline({
	path: centerOfMassLocus,
	geodesic: false,
	strokeColor: '#FF0000',
	strokeOpacity: 1.0,
	strokeWeight: 2
    });
    locus.setMap(map);

    map.fitBounds(bounds);

    var listener = google.maps.event.addListener(map, "idle", function() {
	map.setZoom(2);
	google.maps.event.removeListener(listener);
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map
    });
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBPiGF_amHt8-0fWOgkKQRKaAAcsDzv_L8&libraries=visualization&v=3.exp&' + 'callback=initialize';
//    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=visualization&v=3.exp&' + 'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
