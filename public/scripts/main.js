'use strict';

/*
start with bday info
Get the product data and use the stored variables to get the data we need.

*/

var mykey = config.MY_KEY;

var app = {};

var map = void 0;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 43.6482644, lng: -79.4000474 },
    zoom: 10
  });
}

app.selectedArticle = [];

app.randomArticle = function (array) {
  console.log(array);
  var oneArticle = Math.floor(Math.random() * array.length);
  array.splice(array[oneArticle]);
  app.selectedArticle.push(array[oneArticle]);
};

// News API
app.getArticle = function (userArticle) {
  // console.log(userArticle);
  return $.ajax({
    url: 'https://newsapi.org/v2/everything?sources=cbc-news&q=' + userArticle + '&apiKey=fac3a83aaa654849a854c0e3d010faa9'
  }).then(function (res) {
    console.log(res.articles);
    var articlesReturned = res.articles;
    var articleArray = [];

    articleArray.push(articlesReturned);
    for (var i = 0; i < articleArray.length; i++) {
      app.randomArticle(articleArray);
    }
    console.log(articleArray);
    // app.postArticle(articlesReturned)
  }).fail(function (err) {
    throw err;
  });
};

// users article choice
app.userInput = function () {
  $('form').on(' submit', function (e) {
    e.preventDefault();
    var article = $('select').val();
    // console.log(article);
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