
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


var gName;
var formattedAddress;
var placeLat;
var placeLng;

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('search-map'), {
    center: {lat: 51.51734, lng: -0.0731781},
    zoom: 15,
    mapTypeId: 'roadmap'
  });

    var youIcon = 'https://s31.postimg.org/m9bv4fq7f/you_icon.png'
    var myMarker = new google.maps.Marker({
      map: map,
      icon: youIcon,
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            myMarker.setPosition(myLocation);
            map.setCenter(myLocation)
        });
    }


  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      gName = place.name;
      formattedAddress = place.formatted_address;
      placeLat = place.geometry.location.lat();
      placeLng = place.geometry.location.lng();
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var icon = {
        url: 'https://s32.postimg.org/loajgnlg5/item_icon.png',
        // url: place.icon,
        // size: new google.maps.Size(71, 71),
        // origin: new google.maps.Point(0, 0),
        // anchor: new google.maps.Point(17, 34),
        // scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

}
