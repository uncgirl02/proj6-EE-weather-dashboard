var appId = "394a022ad4ac646b80322358258d74f5"
var cityInputEl = document.querySelector('#city')
var userFormEl = document.querySelector("#user-form")
var weatherContainerEl = document.querySelector('#city-weather')
var searchButton = document.querySelector('#btn')
var currentWeatherContainter = document.querySelector("#current-weather")
var forcastContainer = document.querySelector("#forecast")


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
  
    var subTitle = document.querySelector(".subtitle");
    
    var currentTemp = document.createElement("div");
    currentTemp.text(conditions.list[0].main.temp);
    subTitle.append(currentTemp);

    var currentWind = document.createElement("div");
    currentWind.text(conditions.list[0].wind.speed);
    currentTemp.append(currentWind);
    
    var currentHumidity = document.createElement("div");
    currentHumidity.text(conditions.list[0].main.humidity);
    currentWind.append(currentHumidity)
  
  
    var lat = conditions.city.coord.lat;
    var lon = conditions.city.coord.lon;
    getUvIndex(lat, lon);
    getForecast(lat, lon);
  }

  function createCurrentUvi(uvi) {
    var currentUVI = document.createElement("div").addClass("text-white p-1");
    var uviIndex = uvi.current.uvi;
    currentUVI.text(uviIndex);
  
    if (uviIndex <= 2) {
      currentUVI.addClass("bg-success");
    } else if (uviIndex > 2 && uviIndex <= 7) {
      currentUVI.addClass("bg-warning");
    } else if (uviIndex > 7) {
      currentUVI.addClass("bg-danger");
    }

    currentHumidity.append(currentUVI)
  }

  function futureForecast(forecast) {
    forcastContainer.text = ("")

    var dailyForecast = forecast.daily;
    for (var i = 1; i < 6; i++) {
      var nextDay = dailyForecast[i];
      var forcastedDate = moment(nextDay.dt * 1000).format("l");
  
      var dayWeather = document.createElement("div").addClass("card d-flex bg-navy text-white p-3 col-8 col-xl-2 col-md-4 col-sm-4 m-3");
      forcastContainer.append(dayWeather);
  
      var weatherDate = document.createElement("h5").addClass("d-flex justify-content-center");
      weatherDate.text(forcastedDate);
      dayWeather.append(weatherDate);
  
      var forecastIcon = nextDay.weather[0].icon;
      var forecastIconUrl = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";
      var weatherIcon = document.createElement("img").attr("src", forecastIconUrl);
      dayWeather.append(weatherIcon);
  
      var maxTemp = document.createElement("div").addClass("text-start");
      maxTemp.text("High Temp:" + nextDay.temp.max + "°F");
      dayWeather.append(maxTemp);
  
      var minTemp = document.createElement("div").addClass("text-start");
      minTemp.text("Low Temp:" + nextDay.temp.min + "°F");
      dayWeather.append(minTemp);
  
      var dayHumidity = document.createElement("div").addClass("text-start");
      dayHumidity.text("Humidity:" + nextDay.humidity);
      dayWeather.append(dayHumidity);
    }
  }

// add event listeners to forms
searchButton.addEventListener('submit', formSubmitHandler);

