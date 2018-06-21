const app = {};

app.selectedArticle = [];
app.mykey = config.MY_KEY;

// generic Map posting when app opens
let map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 43.6482644, lng: -79.4000474 },
    zoom: 10
  });
}



// insert those codes into the places API
app.getCoffeeShop = (long, lat) => {
  console.log(long, lat);
  
  $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method: 'GET',
    data: {
      reqUrl: `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      params: {
        key: app.mykey,
        "location": {
          "lat": locationLong,
          "lng": locationLat
        },
      }
    }
  }).then(function (res) {
    // Save the results in an array
    console.log(res);

  }).fail((err) => {
    throw err;
  })
};

//Call Google API geocode
//Get coordinates from inputted address
app.getLocation = (userLocation) => {
  $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method: 'GET',
    data: {
      reqUrl: `https://maps.googleapis.com/maps/api/geocode/json`,
      params: {
        key: app.mykey,
        address: userLocation
      }
    }
  }).then(function (res) {
    // console.log(res.results[0]);
    const locationLat = res.results[0].geometry.location.lat;
    console.log(locationLat);

    const locationLong = res.results[0].geometry.location.lng;
    console.log(locationLong);

    app.getCoffeeShop(locationLong, locationLat);

  }).fail((err) => {
    throw err;
  })
};




// app.randomArticle = (arrayNum) => {
//   console.log(arrayNum);
//   const oneArticle = Math.floor(Math.random() * array.length);
//   array.splice(array[oneArticle]);
//   app.selectedArticle.push(array[oneArticle], 1);  
// }

app.postArticle = (oneArticle) => {
  // console.log(oneArticle);
}

// ac81c5c1272f4109b571719e404991f3
// fac3a83aaa654849a854c0e3d010faa9

// News API
app.getArticle = (userArticle) => {
  // console.log(userArticle);
  return $.ajax({
    url: `https://newsapi.org/v2/everything?sources=cbc-news&q=${userArticle}&apiKey=ac81c5c1272f4109b571719e404991f3`, 
  }).then( function (res) {
    // console.log(res.articles);
    const articlesReturned = res.articles[0];
    const articleArray = [];
    // console.log(articleArray);

    // articleArray.push(articlesReturned);
    
    // for (let key in articleArray) {
      
    for (let i = 0; i < articlesReturned.length; i++) {
      // app.randomArticle();
      articleArray.push(articlesReturned)
      console.log(articlesReturned);
    }   
    // console.log(articleArray);

    app.postArticle(articlesReturned);  

    // const oneArticle = Math.floor(Math.random() * articlesReturned.length);
    // console.log(oneArticle);
      
  }).fail( (err) => {
    throw err;
  });
}

// users article choice
app.userInput = () => {
  $('form').on(' submit', function (e){
    e.preventDefault()        
    const article = $('select').val();
    const userLocation = $('#location').val();
    app.getLocation(userLocation);
    app.getArticle(article);
  });
};

app.init = () => { // Everything gets called inside of this function 
  app.userInput();
};

// Document ready
$( () => {
  app.init(); 
});









// app.apiURL = 'https://maps.googleapis.com/maps/api/geocode/json';
// app.apiURLPlaces = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";



//Call Google API geocode
//Get coordinates from inputted address
// app.getLocation = function (locationInput) {
//   $.ajax({
//     url: "http://proxy.hackeryou.com",
//     method: "GET",
//     dataType: "json",
//     data: {
//       reqUrl: app.apiURL,
//       params: {
//         key: app.apiKey,
//         address: locationInput
//       }
//     }
//   }).then(res => {
//     console.log(res);
//     app.lat = res.results[0]['geometry']['location']['lat'];
//     app.lng = res.results[0]['geometry']['location']['lng'];
//     app.getWeather(app.lat, app.lng, app.getWeekend(currDay));
//     app.drawMap();
//   });
// }




// //Call Google Places API and return place suggestions based on location and weather forecast
// app.getPlaces = function (lat, lng, activity, locationType) {
//   $.ajax({
//     url: "http://proxy.hackeryou.com",
//     method: "GET",
//     dataType: "json",
//     data: {
//       reqUrl: app.apiURLPlaces,
//       params: {
//         key: "AIzaSyCiWIEylBJ4a0DGvCPOZnFN3WAlM1zJiJE",
//         location: `${lat},${lng}`,
//         rankby: 'distance',
//         type: locationType
//       }
//     }
//   })
//     .then((res) => {
//       const place = res.results;
//       app.displayPlace(place, lat, lng);
//     });
// }




// //setup google map
// app.drawMap = function () {
//   //google map script
//   var script = document.createElement('script');
//   script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCiWIEylBJ4a0DGvCPOZnFN3WAlM1zJiJE";
//   document.body.appendChild(script);
// }


// //creates google map
// app.initMap = function (latNew, lngNew, placesInfo) {
//   var selectedPlace = { lat: latNew, lng: lngNew };
//   console.log(selectedPlace);
//   var map = new google.maps.Map(document.getElementById('map'), {
//     // zoom: 15,
//     center: selectedPlace
//   });

//   // Places marker with your location
//   var yourLocation = new google.maps.Marker({
//     position: { lat: latNew, lng: lngNew },
//     map: map,
//     icon: 'assets/People_Location-512.png'
//   })


//   //information window for each returned place marker
//   var infowindow = new google.maps.InfoWindow();

//   var marker, i;
//   let markers = [];
//   markers.push(yourLocation);

//   //loops through all the places
//   for (i = 0; i < placesInfo.length; i++) {
//     marker = new google.maps.Marker({
//       position: new google.maps.LatLng(placesInfo[i].lat, placesInfo[i].lng),
//       map: map
//     });
//     markers.push(marker);

//     //loops though array of markers and gets position to set bounds of map
//     const bounds = new google.maps.LatLngBounds();
//     for (let i = 0; i < markers.length; i++) {
//       bounds.extend(markers[i].getPosition());
//     }

//     map.fitBounds(bounds);

//     if (placesInfo[i].rating === undefined) {
//       placesInfo[i].rating = 'No rating';

//     }
//     console.log(placesInfo[i].rating);
//     //event listener for displaying infowindow on click of the markers
//     google.maps.event.addListener(marker, 'click', (function (marker, i) {
//       return function () {
//         infowindow.setContent(`<p>Name: ${placesInfo[i].name}</p> <p>Address: ${placesInfo[i].address}</p> <p>Rating: ${placesInfo[i].rating}</p>`);
//         infowindow.open(map, marker);
//       }
//     })(marker, i));
//   }
// }

// //Initialize app
// app.init = function () {
//   $('.response').hide();
//   $('.loc-input').hide();
//   app.userInput();
//   app.getCurrDate();
//   app.showInput();
// }

// //Draw map
// app.drawMap = function () {
//   var script = document.createElement('script');
//   script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCiWIEylBJ4a0DGvCPOZnFN3WAlM1zJiJE";
//   document.body.appendChild(script);
// }

