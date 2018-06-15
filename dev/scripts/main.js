/*
start with bday info
Get the product data and use the stored variables to get the data we need.

*/
const app = {};

app.getBday = (userBday) => {
  console.log(userBday);
  
  // fac3a83aaa654849a854c0e3d010faa9

  let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json`;
  url += '?' + $.param({
    'api-key': `d9bea6db046441fd865b5cb6942ff78d`,
    'q': `technology`,
    'begin_date': `$(userBday)`,
    'end_date': `$(userBday)`
    // 'end_date': "19901123"
  });
  $.ajax({
    url: url,
    method: 'GET',
  }).done( (result) => {
    console.log(result);
    
  }).fail( (err) => {
    throw err;
  });
}

app.userInput = () => {
  $('form').on('submit', function (e){
    e.preventDefault()        

    const birthday = $('#datepicker').val();
    console.log(birthday);
    
    app.getBday(birthday);
  });
};

app.init = () => { // Everything gets called inside of this function    
  app.userInput();
};

// Document ready
$( () => {
  app.init(); 
});


