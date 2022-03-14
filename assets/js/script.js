var appId = "394a022ad4ac646b80322358258d74f5"
var cityInputEl = document.querySelector('#city')
var userFormEl = document.querySelector("#user-form")
var weatherContainerEl = document.querySelector('#city-weather')
var searchButton = document.querySelector('#btn')
var cityButton = document.querySelector("#saved-cities")
var currentWeatherContainer = document.querySelector("#current-weather")
var forecastContainer = document.querySelector("#forecast")
var dayForecastContainer = document.querySelector("#day-forecast")
var cityName = ""
var currentCity = document.querySelector("#city-search-term");
var currentDate = document.querySelector("#current-date")
var currentIcon = document.querySelector("#weather-icon");
var subTitle = document.querySelector(".subtitle");
var currentHumidity = document.createElement("div");
var cityArray = {};



var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
    // get value from input element
    cityName = cityInputEl.value.trim();
    //If there is a value to CityName, run getWeather
    if (cityName) {
        getWeather();
        saveCities();
        displayList();

        // clear old content
        weatherContainerElinnerText = Content = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};

//Function to save searches to local storage
function saveCities() {
  cityArray = JSON.parse(localStorage.getItem("cityArray")) || []
  console.log(cityArray)
  cityName = cityInputEl.value.trim();
  cityArray.push(cityName);
  localStorage.setItem("savedCity", JSON.stringify(cityArray));
}

//Function to display previous city searches to webpage

function displayList() {
  
  for (var i = 0; i < cityArray.length; i++) {
    var savedCityContainer = document.querySelector("#saved-cities")
    var cityList = document.createElement("button")
    cityList.className = "btn btn-secondary m-2"
    cityList.innerText = cityArray[i];
    savedCityContainer.appendChild(cityList);
  }
}

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

  currentWeatherContainer.className = "border border-secondary rounded-2 ms-3 mb-3"
  
  var icon = weather.list[0].weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
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

  currentWeatherContainer = Content = '';
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
  } else if (uviIndex > 2 && uviIndex <= 7) {
    uviColor.className = "p-1 bg-warning rounded";
  } else if (uviIndex > 7) {
    uviColor.className = "p-1 bg-danger rounded";
  }
}

//Function to display the 5 Day future Forcast
function futureForecast(forecast) {

  var futureHeader = document.querySelector("#forecast-header")
  futureHeader.innerText = "5-Day Forecast:"
  futureHeader.className = "m-0 ps-3 pt-3 pb-3 fw-bold"
  
  var dailyForecast = forecast.daily;
  for (var i = 1; i < 6; i++) {
    var nextDay = dailyForecast[i];
    var forecastedDate = moment(nextDay.dt * 1000).format("l");

    var dayWeather = document.createElement("div")
    dayWeather.className = "weather-card card d-flex text-white p-3 col-8 col-xl-2 col-md-4 col-sm-4 m-3";
    dayForecastContainer.appendChild(dayWeather);

    var weatherDate = document.createElement("h5")
    weatherDate.className = "d-flex justify-content-center";
    weatherDate.innerText = forecastedDate;
    dayWeather.appendChild(weatherDate);

    var forecastIcon = nextDay.weather[0].icon;
    var forecastIconUrl = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", forecastIconUrl);
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
  forecastContainer = Content = '';
}

// add event listener to forms
userFormEl.addEventListener('submit', formSubmitHandler);

