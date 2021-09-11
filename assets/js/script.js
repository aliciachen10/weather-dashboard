var searchButton = document.getElementById('search-button');
var cityInput = document.getElementById('city-input');
var daily = document.getElementById('daily')
var fiveDay = document.getElementById('five-day')
var fiveTitleHolder = document.getElementById('five-title-holder')
var cityButtons = document.getElementById('city-buttons')
var apiKey = '462f9e62962cae328d8a6296900b6569';

var longitude;
var latitude;
var newDiv = document.createElement("div")

function getApi() {

    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput.value + '&appid=' + apiKey
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log(data)
        // TO DO MAKE THIS ONE FUNCTION THAT THIS CALLS THAT GIVES YOU THE TEXT BOX
        var newh2 = document.createElement("h2");

        newh2.innerHTML = cityInput.value
        newh2.innerHTML += " (" + moment().format("l") + ")"

        // newh2.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>'

        daily.appendChild(newh2)

        newDiv.innerHTML = "<p>Temp: " + Math.round(data.main.temp - 273.15) + " *C</p>"
        newDiv.innerHTML += "<p>Wind: " + data.wind.speed + " MPH</p>"
        newDiv.innerHTML += "<p>Humidity: " + data.main.humidity + " %</p>"

        latitude = data.coord.lat
        longitude = data.coord.lon
        getUVIndex(latitude, longitude)
        
    })

    // console.log("latitude>>" + latitude) // how do i get this to log? 
    // console.log("longitude>>" + longitude) // how do i get this to log? 

}

function getUVIndex(latitude, longitude) {
    console.log(latitude + ", " + longitude)

    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly,minutely,alerts&appid=' + apiKey
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        newDiv.innerHTML += "UV Index: <button class=&quot;btn btn-primary&quot;>" + data.current.uvi + "</button>"
        daily.appendChild(newDiv)


        //make this into a new function
        console.log(data.daily[0])
        console.log(data.daily[0].temp.day, "+++",
            data.daily[0].wind_speed, "+++",
            data.daily[0].humidity)

        var fiveTitle = document.createElement("h3")

        fiveTitle.innerHTML = "5-Day Forecast"
        fiveTitleHolder.appendChild(fiveTitle)

        var cardDiv = {}

        for (var i = 0; i < 5; i++) {
            cardDiv[i] = document.createElement("div")

            cardDiv[i].setAttribute("class", "col-2");
    
            cardDiv[i].innerHTML = moment().add(i,'days').format("l")
            // cardDiv.innerHTML += "<i class=&quot;fa fa-trash-o&quot; aria-hidden=&quot;true&quot;></i>"
            cardDiv[i].innerHTML += "<p>Temp: " + Math.round(data.daily[i].temp.day - 273.15) + " *C</p>"
    
            cardDiv[i].innerHTML += "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>"
    
            cardDiv[i].innerHTML += "<p>Humidity: " + data.daily[i].humidity + " %</p>"
            fiveDay.appendChild(cardDiv[i])

        }
    })
}

function saveCity() {

}

  searchButton.addEventListener('click', getApi);
  searchButton.addEventListener('click', saveCity);

  //TODO: get the weather icon to the side working
  //todo: get all the icons in different parts of the script working
  //q: is data[0] the current day, and then data[1] moving forward? 