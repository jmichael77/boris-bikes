// TFL API LINK https://api.tfl.gov.uk/BikePoint/?app_key=70f368b0777b1f4a568b24aadb61ce78&app_id=eb934f02
// GOOGLE MAPS API LINK https://maps.googleapis.com/maps/api/js?key=AIzaSyCtDCJX_HnBmTn1ePWnb3R4urx9N0EBe6o&libraries=places

var map = null;
var currentPosition = null;
var getPosition = null;
var infoWindow = null;

var directionsDisplay;
var directionsService;

/////////////// Initializing the map ///////////////
function initMap(){
  // Initializing Directions
  directionsDisplay = new google.maps.DirectionsRenderer();

  // Map Options
  var options = {
    zoom: 12,
    center: {lat:51.507281, lng:-0.127566},
    gestureHandling: 'auto'
  };

  // Initializing New Map
  map = new google.maps.Map(document.getElementById('map_canvas'), options);

  // Directions Display
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));
};

/////////////// Adds All Bikepoint Markers ///////////////
function addMarker(location, bikesAvailable) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    label: bikesAvailable, 
  });

  marker.addListener('click', function() {
    var markerPosition = marker.getPosition()
    calcRoute(
      {lat: currentPosition.latitude, lng: currentPosition.longitude},
      {lat: markerPosition.lat(), lng: markerPosition.lng()}
    )
  });
};

/////////////// Directions ///////////////
function calcRoute(start, end) {
  directionsService = new google.maps.DirectionsService();
  var request = {
    origin: start,
    destination: end,
    travelMode: 'WALKING'
  };
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(response);
    }
  });
};

/////////////// jQuery & TFL API & GEOLOCATION & LOADING ///////////////

////////////// Get Lat & Lng For All Bike Locations 
function getLatLng() {
  $.ajax({ 
    url: "https://api.tfl.gov.uk/BikePoint/?app_key=70f368b0777b1f4a568b24aadb61ce78&app_id=eb934f02",
    success: function(data){
      for (var i = 0; i < data.length; i++) {
        var location = { lat: data[i].lat, lng: data[i].lon };
        var bikesAvailable = data[i].additionalProperties[6].value;
        addMarker(location, bikesAvailable);
      };
    }
  });
};

/////////////// Loading Gif 
function showLoadingGif() {
  $('#map_canvas').fadeTo(600, 0, function() {
    $(this).delay(600);
  });
  $("#loading").fadeIn(600);
}

function hideLoadingGif() {
  $("#loading").fadeOut(200);
  $('#map_canvas').fadeTo(600, 0, function(){
    $(this).fadeTo(600, 1);
  });
}

function hideLoadingGifForError() {
  $("#loading").fadeOut(200);
  $('#map_canvas').fadeTo(1200, 0, function(){
    $(this).fadeTo(1200, 1);
  });
}

/////////////// Geo Locating Error Message

function showError() {
  $("#error-message").fadeIn(600)
}

/////////////// Geo location button ///////////////
$('.find-me').on('click', function(){
  showLoadingGif();

  if(infoWindow !== null) {
    infoWindow.close()
  }

  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentPosition = position.coords;
      map.setZoom(16);

      getLatLng();

      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You Are Here!');
      infoWindow.open(map);
      map.setCenter(pos);
      hideLoadingGif()
    }, 
    function() {
      hideLoadingGifForError()
      showError()
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
      // Browser doesn't support Geolocation
      hideLoadingGif()
      showError()
      handleLocationError(false, infoWindow, map.getCenter());
    }
});

/////////////// Show All Markers On Button Click
$('.show-all').on('click', function(){
  getLatLng();
  map.setZoom(12);
  map.setCenter({lat:51.507281, lng:-0.127566});
});

/////////////// Landing Page Stuff ///////////////

/////////////// Mute Button
$("video").prop('muted', true);

$(".mute-video").click(function () {
    if ($("video").prop('muted')) {
        $("video").prop('muted', false);
        $(this).addClass('unmute-video');

    } else {
        $("video").prop('muted', true);
        $(this).removeClass('unmute-video');
    }
    console.log($("video").prop('muted'))
});

////////////// Main Page Fade When Load
$(document).ready(function(){
    $('#wrapped').fadeIn(1500);
});