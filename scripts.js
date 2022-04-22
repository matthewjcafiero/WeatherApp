var apiKey = '88b8118d2b34045a3aafab201da35ed0'
var units = 'imperial'


async function getData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function noCity() {
  document.getElementById("out").innerHTML = document.getElementById("location").value + " is not a valid city, no suggested results";

}

function getWeatherByCity(city) {
  let lat = city.lat;
  let lon = city.lon;
  console.log(lat + " " + lon);
  let url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + "&units=" + units;;
  // let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + "&units=" + units;
  getData(url).then(data => {
    updateWeather(data, city);
    createForecast(data, city);
  }
  );
}

function updateNextHour(data) {
  let output = "";
  for (let i = 15; i <= 60; i = i + 15) {
    output += timeConvert(data.minutely[i].dt + data.timezone_offset) + ": " + (data.minutely[i].precipitation * .0393701) + "  in of rain<br>";
  }
  document.getElementById("forecast").innerHTML = output;
}

function updateHourly(data) {
  let output = "";
  for (let i = 1; i <= 12; i++) {
    output += timeConvert(data.hourly[i].dt + data.timezone_offset) + ": " + data.hourly[i].temp + "&#176 F - "
      + capitalize(data.hourly[i].weather[0].description) + " - "
      + data.hourly[i].clouds + "% cloudy<br>";
  }
  document.getElementById("forecast").innerHTML = output;
}



function createForecast(data, city) {
  let btn1 = document.createElement("button");
  btn1.id = "Forecast NextHour"
  btn1.innerHTML = "Next Hour";
  btn1.onclick = function () { updateNextHour(data); };
  document.getElementById("forecastBtns").append(btn1);

  let btn2 = document.createElement("button");
  btn2.id = "Forecast Hourly"
  btn2.innerHTML = "Hourly";
  btn2.onclick = function () { updateHourly(data); };
  document.getElementById("forecastBtns").append(btn2);

  let btn3 = document.createElement("button");
  btn3.id = "Forecast 4Day"
  btn3.innerHTML = "4 Day";
  btn3.onclick = function () { Update4Day(data); };
  document.getElementById("forecastBtns").append(btn3);

  let btn4 = document.createElement("button");
  btn4.id = "Forecast 7Day"
  btn4.innerHTML = "7 Day";
  btn4.onclick = function () { Update7Day(data); };
  document.getElementById("forecastBtns").append(btn4);

  btn1.click();
}

function destroyForecasts() {
  if (document.getElementById("Forecast NextHour") != undefined) {
    document.getElementById("Forecast NextHour").remove();
  }
  if (document.getElementById("Forecast Hourly") != undefined) {
    document.getElementById("Forecast Hourly").remove();
  }
  if (document.getElementById("Forecast 4Day") != undefined) {
    document.getElementById("Forecast 4Day").remove();
  }
  if (document.getElementById("Forecast 7Day") != undefined) {
    document.getElementById("Forecast 7Day").remove();
  }

  document.getElementById("forecast").innerHTML = "";
}

function updateWeather(data, city) {
  console.log(data);
  document.getElementById("title").innerHTML = city.name + ' - ' + data.current.temp + '&#176 F - ' + data.current.weather[0].main;
  let output = city.name + ", ";
  if (city.state != undefined) {
    output += city.state + ", ";
  }
  output += city.country;
  document.getElementById("outTitle").innerHTML = output;
  output = data.current.temp + '&#176 F - ' + capitalize(data.current.weather[0].description) + '<br><br>';
  // output += "High / Low: " + data.main.temp_min + "&#176 / " + data.main.temp_max + "&#176<br>";
  output += "Feels like: " + data.current.feels_like + '&#176<br>';
  output += "Humidity: " + data.current.humidity + "%<br>";
  output += "Wind Conditions: " + data.current.wind_speed + " mph, " + cardinalConvert(data.current.wind_deg) + "<br>";
  output += "Visibility: " + data.current.visibility / 1000. * .621371 + " mi<br>";
  output += "Cloud Coverage: " + data.current.clouds + "%<br>";
  output += "UV Index: " + data.current.uvi + "<br>";
  output += "Pressure: " + data.current.pressure + " hPa<br>";
  output += "<br>";
  output += "Local Time:<br>";
  //why do I need to hard code in the +4 hrs, is this auto subtracting 4 hrs
  output += "Sunrise: " + timeConvert(data.current.sunrise + data.timezone_offset) + "<br>";
  output += "Current Time: " + timeConvert(data.current.dt + data.timezone_offset) + "<br>";
  output += "Sunset: " + timeConvert(data.current.sunset + data.timezone_offset) + "<br>";
  document.getElementById("out").innerHTML = output;
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
  button.onclick = function () { getWeatherByCity(city); destroySuggestions(); destroyForecasts(); };
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
    console.log(data.length == 1);

    if (data.length == 0) {
      noCity();
    } else if (data.length > 1) {
      data.forEach(city => {
        createSuggestion(city);
      });
      let para = document.createElement("p");
      para.innerHTML = "Displaying first 5 most relevant results.<br>For more specific locations, add specificity to your input by indicating state and/or country.";
      document.getElementById("suggestions").append();
    } else {
      getWeatherByCity(data[0]);
    }
  });
}

