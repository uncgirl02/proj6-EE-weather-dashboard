var appId = "394a022ad4ac646b80322358258d74f5"
var cityInputEl = document.querySelector('#city')
var userFormEl = document.querySelector("#user-form")
var weatherContainerEl = document.querySelector('#city-weather')
var searchButton = document.querySelector('#btn')
var currentWeatherContainter = document.querySelector("#current-weather")


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

// Function to get latitude and longitude coordinates from city name
function getWeather(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + appId + "&units=imperial";
  
    fetch(apiUrl).then(function (response) {
      response.json().then(function (data) {
        currentConditions(data, city);
      });
    });
  }

// Function to get UV Index data with longitute and latitude data
function getUvIndex(lat, lon) {
var uvIndexUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + appId;

fetch(uvIndexUrl).then(function (response) {
    response.json().then(function (data) {
    currentUvIndex(data);
    });
});
}

// Function to get future forcast data with longitute and latitude data
  function getForecast(lat, lon) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,current,alerts&units=imperial&appid=" + appId;
  
    fetch(forecastUrl).then(function (response) {
      response.json().then(function (data) {
        futureForecast(data);
      });
    });
  }
  
  function currentConditions(conditions, city) {
    var currentCity = document.querySelector("#city-search-term");
    currentCity.text(conditions.city.name);
  
    var currentDate = document.querySelector("#current-date")
    currentDate.text(`(${moment(conditions.list.dt_txt).format("l")})`);
 
  
    var currentIcon = document.querySelector("#weather-icon");
    var icon = conditions.list[0].weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    currentIcon.attr("src", iconUrl);
  
    var currentTemp = document.createElement("div");
    currentTemp.text(conditions.list[0].main.temp);

    var currentWind = document.createElement("div");
    currentWind.text(conditions.list[0].wind.speed);
    
    var currentHumidity = document.createElement("div");
    currentHumidity.text(conditions.list[0].main.humidity);
  
  
    var lat = conditions.city.coord.lat;
    var lon = conditions.city.coord.lon;
    getUvIndex(lat, lon);
    getForecast(lat, lon);
  }

  

// add event listeners to forms
searchButton.addEventListener('submit', formSubmitHandler);

