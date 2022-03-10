var appId = "394a022ad4ac646b80322358258d74f5"
var cityInputEl = document.querySelector('#city')
var userFormEl = document.querySelector("#user-form")
var weatherContainerEl = document.querySelector('#city-weather')
var searchButton = document.querySelector('#btn')


var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var cityName = cityInputEl.value.trim();
    //If there is a value to CityName, run getLatLong
    if (cityName) {
        getWeather();

        // clear old content
        weatherContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};

// Main function
function mainFunction() {
    cities.push(search.val());
    saveCities();
    previousCityList(search.val());
    getWeather(search.val());
  }



// Function to get latitude and longitude coordinates from city name
function getWeather(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + appId + "&units=imperial";
  
    fetch(apiUrl).then(function (response) {
      response.json().then(function (data) {
        currentConditions(data, city);
      });
    });
  }

  function getUvi(lat, lon) {
    var uviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + appId;
  
    fetch(uviUrl).then(function (response) {
      response.json().then(function (data) {
        currentUvi(data);
      });
    });
  }

  function getForecast(lat, lon) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,current,alerts&units=imperial&appid=" + appId;
  
    fetch(forecastUrl).then(function (response) {
      response.json().then(function (data) {
        futureForecast(data);
      });
    });
  }
  

// add event listeners to forms
searchButton.addEventListener('submit', formSubmitHandler);

