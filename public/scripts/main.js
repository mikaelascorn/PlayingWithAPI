'use strict';

var app = {};

app.selectedArticle = [];
app.mykey = config.MY_KEY;

app.drawMap = function () {
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + app.mykey;
  document.body.appendChild(script);
};

app.getCoffeeShop = function (long, lat) {
  // console.log(long, lat);
  $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method: 'GET',
    data: {
      reqUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      params: {
        key: app.mykey,
        location: lat + ',' + long,
        rankby: 'distance',
        type: 'cafe'
      }
    }
  }).then(function (res) {
    // Save the results in an array
    // console.log(res.results);
    var places = res.results;
    app.getPlaces(long, lat, places);
  }).fail(function (err) {
    throw err;
  });
};

app.getPlaces = function (long, lat, places) {
  // console.log(places);
  var placesArray = [];
  if (places.length > 0) {
    for (var i = 0; i < places.length; i++) {

      var placesObject = {};
      placesObject = {
        name: places[i].name,
        address: places[i].vicinity,
        rating: places[i].rating,
        lat: places[i].geometry.location.lat,
        lng: places[i].geometry.location.lng
      };

      placesArray.push(placesObject);
    }
    // Initializes map if locations are found
    app.showPlaces(lat, long, placesArray);
  } else {
    //Displays fallback text if no locations are found
    $('#map').append('<h3>Sorry! There\'s no coffee shop around here.</h3>');
    console.log('no results for selected place');
  }
};

// markers and cafe details on map
app.showPlaces = function (lat, long, placesArray) {
  var query1 = Number(lat);
  var query2 = Number(long);
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: query1, lng: query2 }
  });

  var location = new google.maps.Marker({
    position: {
      lat: query1,
      lng: query2
    },
    map: map
  });

  var infowindow = new google.maps.InfoWindow();

  var marker = void 0,
      i = void 0;
  var markers = [];
  markers.push(placesArray);

  // loop through all of the places
  for (i = 0; i < placesArray.length; i++) {
    // console.log(placesArray.length);
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(placesArray[i].lat, placesArray[i].lng),
      map: map
    });
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function (marker, i) {
      return function () {
        infowindow.setContent('<p>Name: ' + placesArray[i].name + '</p> <p>Address: ' + placesArray[i].address + '</p> <p>Rating: ' + placesArray[i].rating + '</p>');
        infowindow.open(map, marker);
      };
    }(marker, i));
  }
};

//Call Google API geocode
//Get coordinates from inputted address
app.getLocation = function (userLocation) {
  $.ajax({
    url: 'http://proxy.hackeryou.com',
    method: 'GET',
    dataType: 'json',
    data: {
      reqUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
      params: {
        key: app.mykey,
        address: userLocation
      }
    }
  }).then(function (res) {
    // console.log(res.results);
    app.locationLat = res.results[0].geometry.location.lat;
    // console.log(locationLat);
    app.locationLong = res.results[0].geometry.location.lng;
    // console.log(locationLong);
    app.getCoffeeShop(app.locationLong, app.locationLat);
    app.drawMap();
  }).fail(function (err) {
    throw err;
  });
};

app.randomArticle = function (arrayNum) {
  var articleIndex = Math.floor(Math.random() * arrayNum.length);
  app.postArticle(arrayNum[articleIndex]);
};

app.startButton = function () {
  $('.start').on('click', function (e) {
    e.preventDefault();
    $('.main-header').fadeOut();
    $('.article').fadeIn();
  });
};

app.postArticle = function (oneArticle) {
  $('.article-result').empty();

  $('.main-results').fadeIn();
  $('.main-results .reset').fadeIn();
  $('.article').fadeOut();
  var articleTitle = oneArticle.title;
  var articleDescription = oneArticle.description;
  var articleLink = oneArticle.url;

  var articlePhoto = oneArticle.urlToImage;
  console.log(articlePhoto);
  console.log(oneArticle);

  var postArticle = '<div class="user-result">\n    <h3>Enjoy your lazy Sunday Funday \uD83D\uDC47</h3>\n    <h4>' + articleTitle + '</h4>\n      <div class="user-contents">\n        <div class="article-result">\n          <h5>' + articleDescription + '</h5>\n          <div class="article-info">\n            <img src="' + articlePhoto + '">\n            <a href="' + articleLink + '" target="_blank">Click to read the full article!</a>\n          </div>\n        </div>\n  \n        <div class="user-map" id="map"></div>\n      </div>\n    </div>';

  $('.article-result').append(postArticle);
};

// News API
app.getArticle = function (userArticle) {
  // console.log(userArticle);
  return $.ajax({
    url: 'https://newsapi.org/v2/everything?sources=cbc-news&q=' + userArticle + '&apiKey=ac81c5c1272f4109b571719e404991f3'
  }).then(function (res) {
    // console.log(res.articles);
    var articlesReturned = res.articles;
    app.randomArticle(articlesReturned);
  }).fail(function (err) {
    throw err;
  });
};

// users article choice and location
app.userInput = function () {
  $('form').on(' submit', function (e) {
    e.preventDefault();
    var userLocation = $('#location').val();

    if (userLocation == '') {
      alert('pick a location');
    } else {
      var article = $('select').val();

      app.getLocation(userLocation);
      app.getArticle(article);
    }
  });
};

app.reset = function (e) {
  $('.main-results .reset').on('click', function (e) {
    console.log('clicked');
    e.preventDefault();
    console.log('reset');
    window.location.reload(true);
  });
}; //FORM RESET

app.init = function () {
  // Everything gets called inside of this function 
  app.userInput();
  app.reset();
  app.startButton();
};

// Document ready
$(function () {
  app.init();
});