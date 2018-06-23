'use strict';

var app = {};

app.selectedArticle = [];
app.mykey = config.MY_KEY;

// generic Map posting when app opens
// app.initMap = function () {
var map = void 0;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 43.6482644, lng: -79.4000474 },
    zoom: 12
  });
}

app.getCoffeeShop = function (long, lat) {
  console.log(long, lat);
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
    app.getPlaces(places);
  }).fail(function (err) {
    throw err;
  });
};

app.getPlaces = function (places) {
  console.log(places);
  var placesArray = [];
  if (places.length > 0) {
    for (var i = 0; i < places.length; i++) {
      console.log(places[i].name);
      console.log(places[i].vicinity);
      console.log(places[i].rating);
      console.log(places[i].geometry.location.lat, places[i].geometry.location.lng);

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
    // app.initMap(lat, long, placesArray);
  } else {
    //Displays fallback text if no locations are found
    $('#map').append('<h3>Sorry! There\'s no coffee shop around here.</h3>');
    console.log('no results for selected place');
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
    var locationLat = res.results[0].geometry.location.lat;
    // console.log(locationLat);

    var locationLong = res.results[0].geometry.location.lng;
    // console.log(locationLong);

    app.getCoffeeShop(locationLong, locationLat);
  }).fail(function (err) {
    throw err;
  });
};

app.randomArticle = function (arrayNum) {
  var articleIndex = Math.floor(Math.random() * arrayNum.length);
  app.postArticle(arrayNum[articleIndex]);
};

app.postArticle = function (oneArticle) {
  $('.articleResult').empty();
  var articleTitle = oneArticle.title;
  var articleDescription = oneArticle.description;
  var articlePhoto = oneArticle.urlToImage;
  var articleLink = oneArticle.url;

  var postArticle = '<div class="userResult">\n    <h3>Your Article:</h3>\n      <h4>' + articleTitle + '</h4>\n      <h4>' + articleDescription + '</h4>\n      <a href="' + articleLink + '">Link to the article</h4>\n      <img src="' + articlePhoto + '">\n    </div>';

  $('.articleResult').append(postArticle);
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

// users article choice
app.userInput = function () {
  $('form').on(' submit', function (e) {
    e.preventDefault();
    var article = $('select').val();
    var userLocation = $('#location').val();
    app.getLocation(userLocation);
    app.getArticle(article);
  });
};

app.init = function () {
  // Everything gets called inside of this function 
  app.userInput();
};

// Document ready
$(function () {
  app.init();
});