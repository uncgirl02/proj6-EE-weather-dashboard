var appId = "394a022ad4ac646b80322358258d74f5"
var cityInputEl = document.querySelector('#city')
var userFormEl = document.querySelector("#user-form")
var weatherContainerEl = document.querySelector('#city-weather')
var searchButton = document.querySelector('#btn')
var currentWeatherContainter = document.querySelector("#current-weather")
var forecastContainer = document.querySelector("#forecast")
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
    currentCity.innerText = cityName
    currentCity.className = "fw-bold fs-1 p-3"
    currentDate.innerText = `(${moment(weather.list.dt_txt).format("l")})`;
    currentDate.className = "fw-bold fs-1 p-3"

    currentWeatherContainter.className = "border border-secondary rounded-2 ms-3"
    
    var icon = weather.list[0].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    console.log(currentIcon);
    currentIcon.setAttribute("src", iconUrl);
    
    var currentTemp = document.createElement("div");
    currentTemp.className = "p-3"
    currentTemp.innerText = "Temp: " + weather.list[0].main.temp + "°F";
    subTitle.append(currentTemp);

    var currentWind = document.createElement("div");
    currentWind.className = "pt-3 pb-3"
    currentWind.innerText = "Wind Speed: " + weather.list[0].wind.speed + "mph";
    currentTemp.append(currentWind);
    
    currentHumidity.innerText = "Humidity: " + weather.list[0].main.humidity + "%";
    currentHumidity.className = "pt-3 pb-3"
    currentWind.append(currentHumidity)
  
  
    var lat = weather.city.coord.lat;
    var lon = weather.city.coord.lon;
    getUvIndex(lat, lon);
    getForecast(lat, lon);
  }

  //Function to Display UV Index
  function currentUvIndex(uvi) {
    var currentUVI = document.createElement("div")
    currentUVI.className = "pt-3 pb-3"
    currentHumidity.append(currentUVI)
    currentUVI.innerText = "UV Index: ";
    
    var uviColor = document.createElement("span")
    currentUVI.append(uviColor)
    var uviIndex = uvi.current.uvi;
    uviColor.innerText = uviIndex
    
    if (uviIndex <= 2) {
      uviColor.className = "p-1 bg-success rounded";
    } else if (uviIndex > 2 && uviIndex <= 5) {
      uviColor.className = "p-1 bg-warning rounded";
    } else if (uviIndex > 5 && uviIndex <= 7) {
      uviColor.className = "p-1 bg-orange rounded";
    } else if (uviIndex > 7) {
      uviColor.className = "p-1 bg-danger rounded";
    }
  }

  //Function to display the 5 Day future Forcast
  function futureForecast(forecast) {

    var futureHeader = document.createElement("h3")
    futureHeader.innerText = "5-Day Forecast:"
    console.log(futureHeader);
    forecastContainer.appendChild(futureHeader)
    forecastContainer.classname = "d-flex flex-column ms-3"

    var dailyForecast = forecast.daily;
    for (var i = 1; i < 6; i++) {
      var nextDay = dailyForecast[i];
      var forecastedDate = moment(nextDay.dt * 1000).format("l");
  
      var dayWeather = document.createElement("div")
      dayWeather.className = "weather-card card d-flex text-white p-3 col-8 col-xl-2 col-md-4 col-sm-4 m-3";
      forecastContainer.appendChild(dayWeather);
  
      var weatherDate = document.createElement("h5")
      weatherDate.className = "d-flex justify-content-center";
      weatherDate.innerText = forecastedDate;
      dayWeather.appendChild(weatherDate);
  
      var forecastIcon = nextDay.weather.icon;
      console.log(forecastIcon);
      var forecastIconUrl = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";
      var weatherIcon = document.createElement("img").setAttribute("src", forecastIconUrl);
      dayWeather.append(weatherIcon);
  
      var maxTemp = document.createElement("div")
      maxTemp.className = "text-start";
      maxTemp.innerText = "High Temp: " + nextDay.temp.max + "°F";
      dayWeather.append(maxTemp);
  
      var minTemp = document.createElement("div")
      minTemp.className = "text-start";
      minTemp.innerText = "Low Temp: " + nextDay.temp.min + "°F";
      dayWeather.append(minTemp);
  
      var dayHumidity = document.createElement("div")
      dayHumidity.className = "text-start";
      dayHumidity.innerText = "Humidity: " + nextDay.humidity + "%";
      dayWeather.append(dayHumidity);
    }
  }

// add event listener to forms
userFormEl.addEventListener('submit', formSubmitHandler);

