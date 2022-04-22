var apiKey = '88b8118d2b34045a3aafab201da35ed0'
var units = 'imperial'


async function getData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function updateWeather(data) {
  console.log(data);
  document.getElementById("out").innerHTML = data.name + ' ' + data.main.temp + ' ' + data.weather[0].main;
  document.getElementById("title").innerHTML = data.name + ' - ' + data.main.temp + ' - ' + data.weather[0].main;
}

function getWeatherByLatLong(lat, long) {
  let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=' + apiKey + "&units=" + units;
  getData(url).then(data => { updateWeather(data); });
}

function noCity() {
  document.getElementById("out").innerHTML = document.getElementById("location").value + " is not a valid city, no suggested results";

}

function getWeatherByCity(city) {
  let lat = city.lat;
  let lon = city.lon;
  console.log(lat + " " + lon);
  let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + "&units=" + units;
  getData(url).then(data => {
    updateWeather(data);
  }
  );
}

function destroySuggestions() {
  while (document.getElementById("suggestionButton")) {
    document.getElementById("suggestionButton").remove();
  }
}

//ONLY LISTS STATES FOR US BASED CITIES
function createSuggestion(city) {
  let button = document.createElement("button");
  let state = '';
  //This only adds a comma if a state tag exists
  if (city.state != "") {
    state = city.state + ", ";
  }
  button.innerHTML = city.name + ", " + state + city.country;
  button.id = "suggestionButton";
  button.onclick = function () { getWeatherByCity(city); destroySuggestions(); };
  document.getElementById("search").appendChild(button);
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
    } else {
      getWeatherByCity(data[0]);
    }


  });
}
