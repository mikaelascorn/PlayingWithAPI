'use strict';

/*
start with bday info
Get the product data and use the stored variables to get the data we need.

*/
var app = {};

app.getBday = function (userBday) {
  console.log(userBday);

  // fac3a83aaa654849a854c0e3d010faa9

  var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  url += '?' + $.param({
    'api-key': 'd9bea6db046441fd865b5cb6942ff78d',
    'q': 'technology',
    'begin_date': '$(userBday)',
    'end_date': '$(userBday)'
    // 'end_date': "19901123"
  });
  $.ajax({
    url: url,
    method: 'GET'
  }).done(function (result) {
    console.log(result);
  }).fail(function (err) {
    throw err;
  });
};

app.userInput = function () {
  $('form').on('submit', function (e) {
    e.preventDefault();

    var birthday = $('#datepicker').val();
    console.log(birthday);

    app.getBday(birthday);
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