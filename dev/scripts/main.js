/*
start with bday info
Get the product data and use the stored variables to get the data we need.

*/

const apiKey = config.api_key;

const app = {};

let map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 43.6482644, lng: -79.4000474 },
    zoom: 10
  });
}
    
app.selectedArticle = [];

app.randomArticle = function (array) {
  console.log(array);
  const oneArticle = Math.floor(Math.random() * array.length);
  array.splice(array[oneArticle]);
  app.selectedArticle.push(array[oneArticle]);  
}

// News API
app.getArticle = (userArticle) => {
  // console.log(userArticle);
  return $.ajax({
    url: `https://newsapi.org/v2/everything?sources=cbc-news&q=${userArticle}&apiKey=fac3a83aaa654849a854c0e3d010faa9`, 
  }).then( function (res) {
    console.log(res.articles);
    const articlesReturned = res.articles;
    const articleArray = [];

    articleArray.push(articlesReturned);
    for (let i = 0; i < articleArray.length; i++) {
      app.randomArticle(articleArray);   
    }   
    console.log(articleArray);
    // app.postArticle(articlesReturned)
  }).fail( (err) => {
    throw err;
  });
}

// users article choice
app.userInput = () => {
  $('form').on(' submit', function (e){
    e.preventDefault()        
    const article = $('select').val();
    // console.log(article);
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


