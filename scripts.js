var apiKey = '88b8118d2b34045a3aafab201da35ed0'

async function getData(url) {
  let response = await fetch(url)
  let data = await response.json()
  return data
}

function getWeatherByLatLong(lat, long) {
  var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=' + apiKey + "&units=imperial"
  getData(url).then(data => {
    console.log(data)
    document.getElementById("out").innerHTML = data.name + ' ' + data.main.temp
    document.getElementById("title").innerHTML = data.name + ' - ' + data.main.temp + ' - ' + data.weather[0].main
  }
  )
}
