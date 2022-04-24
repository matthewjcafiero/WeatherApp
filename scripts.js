var apiKey = '88b8118d2b34045a3aafab201da35ed0';
var units = 'imperial';
var degUnits = "&#176 F";
var spdUnits = "mph";
var disUnits = "mi";
var currentCity = undefined;
var currentForecast = 0;
var autpUpdateInterval = undefined;

function refreshData() {
  if (currentCity != undefined) {
    getWeatherByCity(currentCity);
    destroyForecasts();
  }
}

/** [changeUnits()] updates the variables associated with handling the units of 
 * outputs, specifically degrees, speed and distance units, allowing weather 
 * data to be shown using either imperial or metric based values */
function changeUnits() {
  if (units == 'imperial') {
    units = 'metric';
    degUnits = "&#176 C";
    spdUnits = "km/hr";
    disUnits = "km";
    document.getElementById("changeUnits").innerHTML = "Units: Metric";
    if (currentCity != undefined) {
      getWeatherByCity(currentCity);
      destroyForecasts();
    }
  } else if (units == 'metric') {
    units = 'imperial';
    degUnits = "&#176 F";
    spdUnits = "mph";
    disUnits = "mi";
    document.getElementById("changeUnits").innerHTML = "Units: Imperial";
    if (currentCity != undefined) {
      getWeatherByCity(currentCity);
      destroyForecasts();
    }
  }
}

/** [getData(url)] fetches JSON data from any api based on the input [url], and 
 * returns it as a data structure usable by JavaScript */
async function getData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

/** [noCity()] updates the "out" element of the main.html to display a no 
 * response string */
function noCity() {
  document.getElementById("out").innerHTML = document.getElementById("location").value + " is not a valid city.  No suggested results.";
}

/** [getWeatherByCity(city)] takes the input [city], which is a data structure 
 * called from the OpenWeather Geocoding API that holds data about a city 
 * location based on a given latitude and longitude */
function getWeatherByCity(city) {
  let lat = city.lat;
  let lon = city.lon;
  let url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + "&units=" + units;;
  getData(url).then(data => {
    updateWeather(data, city);
    createForecast(data);
  }
  );
}

/** [updateNextHour(data)] takes the weather information provided by the data 
 * structure [data] and updates "forecast" in html.main with the upcoming 1 hour
 * forecast at the time of call in 15 minute intervals */
function updateNextHour(data) {
  let output = "";
  for (let i = 15; i <= 60; i = i + 15) {
    output += timeConvert(data.minutely[i].dt + data.timezone_offset) + ": " + (data.minutely[i].precipitation * .0393701) + "  in of rain<br>";
  }
  document.getElementById("forecast").innerHTML = output;
}

/** [updateHourly(data)] takes the weather information provided by the data 
 * structure [data] and updates "forecast" in html.main with the upcoming hourly
 *  forecast at the time of call for the next 12 hours */
function updateHourly(data) {
  let output = "";
  for (let i = 1; i <= 12; i++) {
    output += timeConvert(data.hourly[i].dt + data.timezone_offset) + ": " + data.hourly[i].temp + degUnits + " - "
      + capitalize(data.hourly[i].weather[0].description) + " - "
      + data.hourly[i].clouds + "% cloudy<br>";
  }
  document.getElementById("forecast").innerHTML = output;
}

/** [update4Day(data)] takes the weather information provided by the data 
 * structure [data] and updates "forecast" in html.main with the upcoming 4 day 
 * forecast at the time of call shown by day */
function update4Day(data) {
  let output = "";
  for (let i = 1; i <= 4; i++) {
    output += dayConvert(data.daily[i].dt + data.timezone_offset) + ": Low / High: "
      + data.daily[i].temp.min + degUnits + " / " + data.daily[i].temp.max
      + degUnits + " - " + capitalize(data.daily[i].weather[0].description) + " - "
      + data.daily[i].clouds + "% cloudy<br>";
  }
  document.getElementById("forecast").innerHTML = output;
}

/** [update7Day(data)] takes the weather information provided by the data 
 * structure [data] and updates "forecast" in html.main with the upcoming 7 day 
 * forecast at the time of call shown by day */
function update7Day(data) {
  let output = "";
  for (let i = 1; i <= 7; i++) {
    output += dayConvert(data.daily[i].dt + data.timezone_offset) + ": Low / High: "
      + data.daily[i].temp.min + degUnits + " / " + data.daily[i].temp.max
      + degUnits + " - " + capitalize(data.daily[i].weather[0].description) + " - "
      + data.daily[i].clouds + "% cloudy<br>";
  }
  document.getElementById("forecast").innerHTML = output;
}

/** [createForecast(data)] takes in the weather information from the data 
 * structure [data] and creates 4  buttons in main.html, where each 
 * button corresponds to a different forecast based on [data].  When a forecast 
 * button is pressed, it updates the "forecast" paragraph of main.html to show 
 * the associated forecast.  The forecasts that can be called are "Next Hour", 
 * "Hourly", "4 Day", and "7 Day".  This function also automatically presses the
 * "Next Hour" forecast button, displaying the forecast instantly to the user 
 * without need for input, so when [createForecast(data)] is called both the 
 * buttons and a forecast are shown. */
function createForecast(data) {
  let btn1 = document.createElement("button");
  btn1.id = "Forecast NextHour"
  btn1.innerHTML = "Next Hour";
  btn1.onclick = function () { currentForecast = 1; updateNextHour(data); }
  document.getElementById("forecastBtns").append(btn1);

  let btn2 = document.createElement("button");
  btn2.id = "Forecast Hourly"
  btn2.innerHTML = "Hourly";
  btn2.onclick = function () { currentForecast = 2; updateHourly(data); }
  document.getElementById("forecastBtns").append(btn2);

  let btn3 = document.createElement("button");
  btn3.id = "Forecast 4Day"
  btn3.innerHTML = "4 Day";
  btn3.onclick = function () { currentForecast = 3; update4Day(data); }
  document.getElementById("forecastBtns").append(btn3);

  let btn4 = document.createElement("button");
  btn4.id = "Forecast 7Day"
  btn4.innerHTML = "7 Day";
  btn4.onclick = function () { currentForecast = 4; update7Day(data); }
  document.getElementById("forecastBtns").append(btn4);

  if (currentForecast <= 1) {
    btn1.click();
  } else if (currentForecast == 2) {
    btn2.click();
  } else if (currentForecast == 3) {
    btn3.click();
  } else if (currentForecast == 4) {
    btn4.click();
  }

}

/** [destroyFoercasts()], when called, checks for any forecasting buttons and 
 * removes them from main.html, and then clears the text of "forecast" in 
 * main.html by changing its value to "". */
function destroyForecasts() {
  while (document.getElementById("Forecast NextHour") != undefined) {
    document.getElementById("Forecast NextHour").remove();
  }
  while (document.getElementById("Forecast Hourly") != undefined) {
    document.getElementById("Forecast Hourly").remove();
  }
  while (document.getElementById("Forecast 4Day") != undefined) {
    document.getElementById("Forecast 4Day").remove();
  }
  while (document.getElementById("Forecast 7Day") != undefined) {
    document.getElementById("Forecast 7Day").remove();
  }

  document.getElementById("forecast").innerHTML = "";
}

/** [destroyData()], when called, changes the text of both "out" and "outTitle"
 *  in main.html to "", effectively clearing them. */
function destroyData() {
  if (document.getElementById("out") != undefined) {
    document.getElementById("out").innerHTML = "";
  }
  document.getElementById("outTitle").innerHTML = "";
  currentCity = undefined;
  //TODO: not sure if I want this here, but cant put this in destroy forecast
  currentForecast = 0;
}

/** [updateWeather(data, city)]  */
function updateWeather(data, city) {
  console.log(data);
  document.getElementById("title").innerHTML = city.name + ' - ' + data.current.temp + degUnits + ' - ' + data.current.weather[0].main;
  let output = city.name + ", ";
  if (city.state != undefined) {
    output += city.state + ", ";
  }
  output += city.country;
  document.getElementById("outTitle").innerHTML = output;
  output = data.current.temp + degUnits + ' - ' + capitalize(data.current.weather[0].description) + '<br><br>';
  output += "High / Low: " + data.daily[0].temp.min + degUnits + " / " + data.daily[0].temp.max + degUnits + "<br>";
  output += "Feels like: " + data.current.feels_like + degUnits + '<br>';
  output += "Humidity: " + data.current.humidity + "%<br>";
  output += "Wind Conditions: " + data.current.wind_speed + " " + spdUnits + ", " + cardinalConvert(data.current.wind_deg) + "<br>";
  let temp = data.current.visibility / 1000.
  if (units == 'imperial') {
    temp = temp * .621371;
  }
  output += "Visibility: " + temp + " " + disUnits + "<br>";
  output += "Cloud Coverage: " + data.current.clouds + "%<br>";
  output += "UV Index: " + data.current.uvi + "<br>";
  output += "Pressure: " + data.current.pressure + " hPa<br>";
  output += "<br>";
  output += "Local Time:<br>";
  output += "Sunrise: " + timeConvert(data.current.sunrise + data.timezone_offset) + "<br>";
  output += "Current Time: " + timeConvert(data.current.dt + data.timezone_offset) + "<br>";
  output += "Sunset: " + timeConvert(data.current.sunset + data.timezone_offset) + "<br>";
  document.getElementById("out").innerHTML = output;
}



function dayConvert(sec) {
  let date = new Date(sec * 1000);
  let str = date.toUTCString();
  let tempStr1 = str.split(",");
  return tempStr1[0];
}

function timeConvert(sec) {
  let date = new Date(sec * 1000);
  let str = date.toUTCString();
  let tempStr1 = str.split(" ");
  let tempStr2 = tempStr1[4].split(":");
  return timeAbbrev(tempStr2[0], tempStr2[1]);
}

function timeAbbrev(hr, min) {
  if (parseInt(hr) <= 12) {
    return hr + ":" + min + " AM";
  } else {
    return (parseInt(hr) - 12) + ":" + min + " PM";
  }
}

function cardinalConvert(deg) {
  if (deg <= 11.25 || deg > 348.75) {
    return "N";
  } else if (deg < 11.25 || deg > 33.75) {
    return "NNE";
  } else if (deg < 33.75 || deg > 56.25) {
    return "NE";
  } else if (deg < 56.25 || deg > 78.75) {
    return "ENE";
  } else if (deg < 78.75 || deg > 101.25) {
    return "E";
  } else if (deg < 101.25 || deg > 123.75) {
    return "ESE";
  } else if (deg < 123.75 || deg > 146.25) {
    return "SE";
  } else if (deg < 146.25 || deg > 168.75) {
    return "SSE";
  } else if (deg < 168.75 || deg > 191.25) {
    return "S";
  } else if (deg < 191.25 || deg > 213.75) {
    return "SSW";
  } else if (deg < 213.75 || deg > 236.25) {
    return "SW";
  } else if (deg < 236.25 || deg > 258.75) {
    return "WSW";
  } else if (deg < 258.75 || deg > 281.25) {
    return "W";
  } else if (deg < 281.25 || deg > 303.75) {
    return "WNW";
  } else if (deg < 303.75 || deg > 326.25) {
    return "NW";
  } else if (deg < 326.25 || deg > 348.75) {
    return "NNE";
  }
}

//Could probably do better than this
function capitalize(str) {
  let temp = "";
  temp += str[0].toUpperCase();
  for (let i = 1; i < str.length; i++) {
    if (str[i] == ' ' && i + 1 < str.length) {
      temp += str[i] + str[i + 1].toUpperCase();
      i++;
    } else {
      temp += str[i];
    }
  }
  return temp;
}

function createSuggestion(city) {
  let button = document.createElement("button");
  let state = '';
  //This only adds a comma if a state tag exists
  if (city.state != undefined) {
    state = city.state + ", ";
  }
  button.innerHTML = city.name + ", " + state + city.country;
  button.id = "suggestionButton";
  button.onclick = function () { currentCity = city; getWeatherByCity(city); destroySuggestions(); destroyForecasts(); };
  document.getElementById("suggestions").append(button);
}

function destroySuggestions() {
  while (document.getElementById("suggestionButton")) {
    document.getElementById("suggestionButton").remove();
  }
}

//locationInput() takes the text input from the form and tests it on various 
//getWeather function calls, allowing the form to accept different input types
//such as lat/long, city name, or zip code, without needing for multiple forms
function locationInput() {
  let input = document.getElementById('location').value;
  input.trim();
  let url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + input + '&limit=5&appid=' + apiKey;
  getData(url).then(data => {
    console.log(data);

    if (data.length == 0) {
      noCity();
      currentCity = undefined;
    } else if (data.length > 1) {
      data.forEach(city => {
        createSuggestion(city);
      });
      let para = document.createElement("p");
      para.innerHTML = "Displaying first 5 most relevant results.<br>For more specific locations, add specificity to your input by indicating state and/or country.";
      document.getElementById("suggestions").append();
    } else {
      currentCity = data[0];
      getWeatherByCity(data[0]);
    }
  });
}
var btn = document.getElementById("curLoc");

function currentLocationInput() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(currentLocationInputTransition);
  } else {
    btn.innerHTML = "Current location not supported by browser";
    btn.disabled = true;
  }
}

function currentLocationInputTransition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = 'http://api.openweathermap.org/geo/1.0/reverse?lat=' + lat + '&lon=' + lon + '&limit=5&appid=' + apiKey;
  getData(url).then(data => {
    console.log(data);
    if (data.length == 0) {
      noCity();
      currentCity = undefined;
    } else {
      currentCity = data[0];
      getWeatherByCity(data[0]);
    }
  })
}

