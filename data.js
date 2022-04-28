/* *** Script Overview *******************************************************
 * [data.js] is a file which manages all of the data involving the weather and 
 * geocoding, both in downloading this data from the OpenWeather APIs, 
 * specifically from the One Call API and the Geocoding API, and in displaying 
 * this data by updating various elements in "index.html" and creating 
 * forecasting elements.  
 * 
 * * How does [data.js] work in general?
 * The key functions in [data.js] are [currentLocationInput()] and 
 * [locationInput()], which create calls to the OpenWeather Geocoding API either
 * based on the user's recorded current location as according to the browser, or
 * according to a user input location name via the "search" form.  For 
 * [locationInput()], if multiple locations are returned from a given name, the 
 * user is prompted to select one of the first 5 returned options.  Now that a 
 * location is selected, a call to the OpenWeaather One Call API is made, 
 * returning weather data for that location.  This data is then used to update 
 * various index.html elements in regards to the current weather, as well as 
 * creating forecasting buttons which allow different forecasts to be displayed 
 * from this data set in index.html.  Other features in [data.js] include the 
 * code for the "changeUnits" button which allows the data to be called in 
 * either imperial or metric units, and the code for the "refreshData" button 
 * which refreshes the data for the selected city.
 * ************************************************************************** */

/* *** Global Variables ***************************************************** */

/** [apiKey] holds my, Matthew Cafiero's, API key provided by OpenWeather in 
 * order to use their API's. */
let apiKey = "88b8118d2b34045a3aafab201da35ed0";

/** [units] is a general variables, used to determine whether imperial or metric
 * data is downloaded from OpenWeather, as well as updating the global unit 
 * variables used for printing. */
var units = "imperial";

/* These unit variables are used to store what units should be printed when 
 * printing out the weather data. */
var degUnits = "&#176 F";
var spdUnits = "mph";
var disUnits = "mi";

/** [currentCity] stores a city data structure, which is used to refresh the 
 * weather data upon clicking the the "autoUpdate" button in index.html (which 
 * is also done automatically as outlined in [actions.js]).  It is undefined 
 * when no city has been searched for and selected by the user. */
var currentCity = undefined;

/** [currentForecast] stores which forecast was selected by the user, so that 
 * when data is uploading that forecast is automatically selected.  0 refers to 
 * no forecast selected, 1 refers to next hour, 2 refers to hourly, 3 refers to 
 * 4 day, and 4 refers to 7 day.  Changing city will cause this value to reset 
 * to 0.*/
var currentForecast = 0;

/* *** Functions ************************************************************ */

/* *** Header Functions ***************************************************** */

/** [changeUnits()] updates the global variables associated with handling the 
 * units of outputs, specifically [degUnits], [spdUnits] and [disUnits] units, 
 * allowing weather data to be shown using either imperial or metric based 
 * values when the elements of index.html are updated. */
function changeUnits() {
  if (units == "imperial") {
    units = "metric";
    degUnits = "&#176 C";
    spdUnits = "km/hr";
    disUnits = "km";
    document.getElementById("changeUnits").innerHTML = "Units: Metric";
    if (currentCity != undefined) {
      getWeatherByCity(currentCity);
      destroyForecasts();
    }
  } else if (units == "metric") {
    units = "imperial";
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

/** [refreshData()], upon call, refreshes the data displayed in main.html by 
 * calling [getWeatherByCity[currentCity]] using the [currentCity] global 
 * variable, and then destroying the forecasts using [destroyForecasts()] so 
 * they can be recreated using [getWeatherByCity()]. */
function refreshData() {
  if (currentCity != undefined) {
    getWeatherByCity(currentCity);
    destroyForecasts();
  }
}

/* *** General Helper Functions ********************************************* */


/** [dayConvert(sec)] is a helper function which takes an inputed number of secs
 * in unix, UTC and returns the day of the week that time represents. */
function dayConvert(sec) {
  let date = new Date(sec * 1000);
  let str = date.toUTCString();
  let tempStr1 = str.split(",");
  return tempStr1[0];
}

/** [timeConvert(sec)] is a helper function which takes an inputed number of 
 * secs in unix, UTC and returns the time in HR:MN that time represents (using a
 * 12 hour clock). */
function timeConvert(sec) {
  let date = new Date(sec * 1000);
  let str = date.toUTCString();
  let tempStr1 = str.split(" ");
  let tempStr2 = tempStr1[4].split(":");
  return timeAbbrev(tempStr2[0], tempStr2[1]);
}

/** [timeAbbrev(hr, min)] is a helper function which converts a given [hr] and 
 * [min] from a 24 hour clock output to a 12 hour clock output. */
function timeAbbrev(hr, min) {
  if (parseInt(hr) <= 12) {
    return hr + ":" + min + " AM";
  } else {
    return (parseInt(hr) - 12) + ":" + min + " PM";
  }
}

/** [getData(url)] is a helper function which fetches JSON data from any api 
 * based on the input [url], and returns it as a data structure usable by 
 * JavaScript */
async function getData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

/* *** Forecast Functions *************************************************** */

/** [updateNextHour(data)] takes the weather information provided by the data 
 * structure [data] and updates "forecast" in html.main with the upcoming 1 hour
 * forecast at the time of call in 15 minute intervals */
function updateNextHour(data) {
  let output = "";
  for (let i = 15; i <= 60; i = i + 15) {
    output += timeConvert(data.minutely[i].dt + data.timezone_offset) + ": "
      + (data.minutely[i].precipitation * .0393701) + "  in of rain<br>";
  }
  document.getElementById("forecast").innerHTML = output;
}

/** [updateHourly(data)] takes the weather information provided by the data 
 * structure [data] and updates "forecast" in html.main with the upcoming hourly
 *  forecast at the time of call for the next 12 hours */
function updateHourly(data) {
  let output = "";
  for (let i = 1; i <= 12; i++) {
    output += timeConvert(data.hourly[i].dt + data.timezone_offset) + ": "
      + data.hourly[i].temp + degUnits + " - "
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
    output += dayConvert(data.daily[i].dt + data.timezone_offset)
      + ": Low / High: " + data.daily[i].temp.min + degUnits + " / "
      + data.daily[i].temp.max + degUnits + " - "
      + capitalize(data.daily[i].weather[0].description) + " - "
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
    output += dayConvert(data.daily[i].dt + data.timezone_offset)
      + ": Low / High: " + data.daily[i].temp.min + degUnits + " / "
      + data.daily[i].temp.max + degUnits + " - "
      + capitalize(data.daily[i].weather[0].description) + " - "
      + data.daily[i].clouds + "% cloudy<br>";
  }
  document.getElementById("forecast").innerHTML = output;
}

/** [destroyForecasts()], when called, checks for any forecasting buttons and 
 * removes them from index.html, and then clears the text of "forecast" in 
 * index.html by changing its value to "". */
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

/** [createForecast(data)] takes in the weather information from the data 
 * structure [data] and creates 4  buttons in index.html, where each 
 * button corresponds to a different forecast based on [data].  When a forecast 
 * button is pressed, it updates the "forecast" paragraph of index.html to show 
 * the associated forecast.  The forecasts that can be called are "Next Hour", 
 * "Hourly", "4 Day", and "7 Day".  This function also automatically presses the
 * "Next Hour" forecast button, displaying the forecast instantly to the user 
 * without need for input, so when [createForecast(data)] is called both the 
 * buttons and a forecast are shown. */
function createForecast(data) {
  if (document.getElementById("Forecast NextHour") == undefined) {
    let btn1 = document.createElement("button");
    btn1.id = "Forecast NextHour"
    btn1.innerHTML = "Next Hour";
    btn1.onclick = function () { currentForecast = 1; updateNextHour(data); }
    document.getElementById("forecastBtns").append(btn1);

    if (currentForecast <= 1) {
      btn1.click();
    }
  }

  if (document.getElementById("Forecast Hourly") == undefined) {
    let btn2 = document.createElement("button");
    btn2.id = "Forecast Hourly"
    btn2.innerHTML = "Hourly";
    btn2.onclick = function () { currentForecast = 2; updateHourly(data); }
    document.getElementById("forecastBtns").append(btn2);

    if (currentForecast == 2) {
      btn2.click();
    }
  }


  if (document.getElementById("Forecast 4Day") == undefined) {
    let btn3 = document.createElement("button");
    btn3.id = "Forecast 4Day"
    btn3.innerHTML = "4 Day";
    btn3.onclick = function () { currentForecast = 3; update4Day(data); }
    document.getElementById("forecastBtns").append(btn3);

    if (currentForecast == 3) {
      btn3.click();
    }
  }

  if (document.getElementById("Forecast 7Day") == undefined) {
    let btn4 = document.createElement("button");
    btn4.id = "Forecast 7Day"
    btn4.innerHTML = "7 Day";
    btn4.onclick = function () { currentForecast = 4; update7Day(data); }
    document.getElementById("forecastBtns").append(btn4);

    if (currentForecast == 4) {
      btn4.click();
    }
  }


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

/* *** Update Weather Functions ********************************************* */

/** [cardinalConvert(deg)] is a helper function for [updateWeather(data, city)] 
 * which takes an input [deg] and returns an associated cardinal direction using
 *  deg as degrees from North. */
function cardinalConvert(deg) {
  if (deg <= 11.25 || deg > 348.75) { return "N"; }
  else if (deg < 11.25 || deg <= 33.75) { return "NNE"; }
  else if (deg < 33.75 || deg <= 56.25) { return "NE"; }
  else if (deg < 56.25 || deg <= 78.75) { return "ENE"; }
  else if (deg < 78.75 || deg <= 101.25) { return "E"; }
  else if (deg < 101.25 || deg <= 123.75) { return "ESE"; }
  else if (deg < 123.75 || deg <= 146.25) { return "SE"; }
  else if (deg < 146.25 || deg <= 168.75) { return "SSE"; }
  else if (deg < 168.75 || deg <= 191.25) { return "S"; }
  else if (deg < 191.25 || deg <= 213.75) { return "SSW"; }
  else if (deg < 213.75 || deg <= 236.25) { return "SW"; }
  else if (deg < 236.25 || deg <= 258.75) { return "WSW"; }
  else if (deg < 258.75 || deg <= 281.25) { return "W"; }
  else if (deg < 281.25 || deg <= 303.75) { return "WNW"; }
  else if (deg < 303.75 || deg <= 326.25) { return "NW"; }
  else if (deg < 326.25 || deg <= 348.75) { return "NNE"; }
}

/** [capitalize(str)] is a helper function for [updateWeather(data, city)] which
 *  takes input [str] and returns the string with the first letter of every word
 *  capitalized. */
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

/** [destroyData()], when called, changes the text of both "out" and "outTitle"
 *  in index.html to "", effectively clearing them, changes [currentCity] to be 
 * undefined representing that no city was selected, and sets [currentForecast] 
 * to 0. */
function destroyData() {
  if (document.getElementById("out") != undefined) {
    document.getElementById("out").innerHTML = "";
  }
  document.getElementById("outTitle").innerHTML = "";
  currentCity = undefined;
  currentForecast = 0;
}

/** [updateWeather(data, city)] takes in weather data [data] and city data 
 * [city] and updates the "title", "outTitle", and "out" elements in index.html 
 * with the correct weather according to the given arguments as well as 
 * according to the values of [units], [degUnits], [spdUnits], and [disUnits].*/
function updateWeather(data, city) {
  console.log(data);
  document.getElementById("title").innerHTML = city.name + " - "
    + data.current.temp + degUnits + " - " + data.current.weather[0].main;
  let output = city.name + ", ";
  if (city.state != undefined) {
    output += city.state + ", ";
  }
  output += city.country;
  document.getElementById("outTitle").innerHTML = output;
  output = data.current.temp + degUnits + " - "
    + capitalize(data.current.weather[0].description) + "<br><br>";
  output += "High / Low: " + data.daily[0].temp.min + degUnits + " / "
    + data.daily[0].temp.max + degUnits + "<br>";
  output += "Feels like: " + data.current.feels_like + degUnits + "<br>";
  output += "Humidity: " + data.current.humidity + "%<br>";
  output += "Wind Conditions: " + data.current.wind_speed + " " + spdUnits
    + ", " + cardinalConvert(data.current.wind_deg) + "<br>";
  let temp = data.current.visibility / 1000.
  if (units == "imperial") {
    temp = temp * .621371;
  }
  output += "Visibility: " + temp + " " + disUnits + "<br>";
  output += "Cloud Coverage: " + data.current.clouds + "%<br>";
  output += "UV Index: " + data.current.uvi + "<br>";
  output += "Pressure: " + data.current.pressure + " hPa<br>";
  output += "<br>";
  output += "Local Time:<br>";
  output += "Sunrise: "
    + timeConvert(data.current.sunrise + data.timezone_offset) + "<br>";
  output += "Current Time: "
    + timeConvert(data.current.dt + data.timezone_offset) + "<br>";
  output += "Sunset: "
    + timeConvert(data.current.sunset + data.timezone_offset) + "<br>";
  document.getElementById("out").innerHTML = output;
}

/* *** Suggestion Functions ************************************************* */

/** [destroySuggestions()] destroys any elements in index.html with the id 
 * "suggestionButton". */
function destroySuggestions() {
  document.getElementById("suggestionsWarning").innerHTML = "";
  while (document.getElementById("suggestionButton")) {
    document.getElementById("suggestionButton").remove();
  }
}

/** [createSuggestion(city)] takes in a city data structure as input.  It then 
 * creates a button element to represent the city in index.html, which if 
 * clicked updates [currentCity] to be the associated city, makes a call to 
 * [getWeatherByCity(city)] for that city, and then destroys all suggestion 
 * buttons as well as any potential existing forecast buttons using 
 * [destroySuggestions()] and [destroyForecasts()]. */
function createSuggestion(city) {
  let button = document.createElement("button");
  let state = "";
  //This only adds a comma if a state tag exists
  if (city.state != undefined) {
    state = city.state + ", ";
  }
  button.innerHTML = city.name + ", " + state + city.country;
  button.id = "suggestionButton";
  button.onclick = function () {
    currentCity = city; getWeatherByCity(city);
    destroySuggestions(); destroyForecasts();
  };
  document.getElementById("suggestions").append(button);
}

/* *** City Data Call Functions ****************************************** */

/** [noCity()] updates the "out" element of the index.html to display a no 
 * response string */
function noCity() {
  document.getElementById("out").innerHTML =
    document.getElementById("location").value
    + " is not a valid city.  No suggested results.";
}

/** [getWeatherByCity(city)] takes the input [city], which is a data structure 
 * called from the OpenWeather Geocoding API that holds data about a city 
 * location based on a given latitude and longitude, and then calls 
 * updateWeather(data, city) to update the date displayed by index.html with the
 * data recieved from the call. It also calls [createForecast(data)] with [data]
 *  in order to create the forecasting buttons and display forecasts.*/
function getWeatherByCity(city) {
  let lat = city.lat;
  let lon = city.lon;
  let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat
    + "&lon=" + lon + "&appid=" + apiKey + "&units=" + units;
  getData(url).then(data => {
    updateWeather(data, city);
    createForecast(data);
  }
  );
}

/* *** Initial Data Call Functions ****************************************** */

/** [locationInput()] takes the input string entered into the "search" from 
 * index.html and after trimming, attempts to make a [getData()] to the 
 * OpenWeather Geocoding API using that location.  
 * There are 2 cases when the call is succesful.  If only one city data 
 * structure is returned by the API, there is only one possible city associated 
 * with the entered location, and therefore we then make a call to 
 * [getWeatherByCity()] using the city data.  We also update [currentCity] to
 * allow for auto updating of the data displayed.  If multiple cities were 
 * returned, we run [createSuggestion(city)] for each city, which creates 
 * buttons in index.html that the user can select to specify which city they 
 * would like to choose, where these buttons will then handle calling the 
 * weather data and updating [currentCity] upon being clicked.  We also display 
 * a message indicating what to do if results are not specific enough.
 * The case when the call is not successful is when no city is found, upon which
 * we call [noCity()] to update index.html with a no suggestions found note for
 * the user.  We then set [currentCity] to be undefined, indicating there is no 
 * city selected for auto update. */
function locationInput() {
  let input = document.getElementById("location").value;
  input.trim();
  let url = "http://api.openweathermap.org/geo/1.0/direct?q=" + input
    + "&limit=5&appid=" + apiKey;
  getData(url).then(data => {
    console.log(data);
    if (data.length == 0) {
      noCity();
      currentCity = undefined;
    } else if (data.length > 1) {
      data.forEach(city => {
        createSuggestion(city);
      });
      document.getElementById("suggestionsWarning").innerHTML = "Displaying "
        + "first " + data.length + " location results found.  For more "
        + "specific results, please enter a more specific location.";
    } else {
      currentCity = data[0];
      getWeatherByCity(data[0]);
    }
  });
}

/** [currentLocationInputHelper()] is a helper function for 
 * [currentLocation()], which takes the position returned by [currentLocation()]
 * and uses this data in order to make a call to the OpenWeather Geocoding API.
 * If successful, we then calls [getWeatherByCity()] on the returned city in 
 * order call for the weather data for this location and to update index.html 
 * with said data.  If unsuccessful, we call [noCity()] to update index.html 
 * with a no suggestions found note for the user. */
function currentLocationInputHelper(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon="
    + lon + "&limit=5&appid=" + apiKey;
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

/** [currentLocationInput()] gets the users current location (so long as they 
 * approve the request).  If approved, iit then calls the helper function 
 * [currentLocationInputHelper()] in order to attempt to make a call to the 
 * OpenWeather Geocoding API. */
function currentLocationInput() {
  let btn = document.getElementById("curLoc");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(currentLocationInputHelper);
  }
}