var appId = "394a022ad4ac646b80322358258d74f5"
var cityInputEl = document.querySelector('#city')
var userFormEl = document.querySelector("#user-form")
var weatherContainerEl = document.querySelector('#city-weather')
var searchButton = document.querySelector('#btn')
var currentWeatherContainter = document.querySelector("#current-weather")
var forcastContainer = document.querySelector("#forecast")
var cityName = ""
var currentCity = document.querySelector("#city-search-term");
var currentDate = document.querySelector("#current-date")
var currentIcon = document.querySelector("#weather-icon");
var subTitle = document.querySelector(".subtitle");
var currentHumidity = document.createElement("div");


var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
    console.log(cityInputEl.value)
    // get value from input element
    cityName = cityInputEl.value.trim();
    //If there is a value to CityName, run getWeather
    if (cityName) {
        getWeather();

        // clear old content
        weatherContainerElinnerText = Content = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};

//Function to save searches to local storage

//Function to display previous city searches to webpage

// Function to get latitude and longitude coordinates from city name
function getWeather() {
    cityName = cityInputEl.value.trim();
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + appId + "&units=imperial";
  
    fetch(apiUrl).then(function (response) {
      response.json().then(function (data) {
        currentWeather(data);
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
  
  //Function to display current weather
  function currentWeather(weather) {
    
    console.log(cityName);
    console.log(currentCity);
    currentCity.innerText = cityName
  
    
    currentDate.innerText = `(${moment(weather.list.dt_txt).format("l")})`;
 
  
    var icon = weather.list[0].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    console.log(currentIcon);
    currentIcon.setAttribute("src", iconUrl);
  
    
    
    var currentTemp = document.createElement("div");
    currentTemp.innerText = "Temp: " + weather.list[0].main.temp + "°F";
    subTitle.append(currentTemp);

    var currentWind = document.createElement("div");
    currentWind.innerText = "Wind Speed: " + weather.list[0].wind.speed + "mph";
    currentTemp.append(currentWind);
    
    currentHumidity.innerText = "Humidity: " + weather.list[0].main.humidity + "%";
    currentWind.append(currentHumidity)
  
  
    var lat = weather.city.coord.lat;
    var lon = weather.city.coord.lon;
    getUvIndex(lat, lon);
    getForecast(lat, lon);
  }

  //Function to Display UV Index
  function currentUvIndex(uvi) {
    var currentUVI = document.createElement("div")
    currentHumidity.append(currentUVI)
    var uviIndex = uvi.current.uvi;
    currentUVI.innerText = uviIndex;
  
    if (uviIndex <= 2) {
      currentUVI.className = "text-white p-1 bg-success";
    } else if (uviIndex > 2 && uviIndex <= 7) {
      currentUVI.className = "text-white p-1 bg-warning";
    } else if (uviIndex > 7) {
      currentUVI.className = "text-white p-1 bg-danger";
    }
  }

  //Function to Display the 5 Day future Forcast
  function futureForecast(forecast) {

    var dailyForecast = forecast.daily;
    for (var i = 1; i < 6; i++) {
      var nextDay = dailyForecast[i];
      var forcastedDate = moment(nextDay.dt * 1000).format("l");
  
      var dayWeather = document.createElement("div").className = "card d-flex bg-navy text-white p-3 col-8 col-xl-2 col-md-4 col-sm-4 m-3";
      forcastContainer.appendChild(dayWeather);
  
      var weatherDate = document.createElement("h5").className = "d-flex justify-content-center";
      weatherDate.innerText = forcastedDate;
      dayWeather.appendChild(weatherDate);
  
      var forecastIcon = nextDay.weather[0].icon;
      var forecastIconUrl = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";
      var weatherIcon = document.createElement("img").attr("src", forecastIconUrl);
      dayWeather.append(weatherIcon);
  
      var maxTemp = document.createElement("div").add("text-start");
      maxTemp.innerText = "High Temp:" + nextDay.temp.max + "°F";
      dayWeather.append(maxTemp);
  
      var minTemp = document.createElement("div").add("text-start");
      minTemp.innerText = "Low Temp:" + nextDay.temp.min + "°F";
      dayWeather.append(minTemp);
  
      var dayHumidity = document.createElement("div").add("text-start");
      dayHumidity.innerText = "Humidity:" + nextDay.humidity;
      dayWeather.append(dayHumidity);
    }
  }

// add event listeners to forms
userFormEl.addEventListener('submit', formSubmitHandler);

