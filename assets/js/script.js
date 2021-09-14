var searchButton = document.getElementById('search-button');
var cityInput = document.getElementById('city-input');
var daily = document.getElementById('daily')
var fiveDay = document.getElementById('five-day')
var fiveTitleHolder = document.getElementById('five-title-holder')
var cityButtons = document.getElementById('city-buttons')
var apiKey = '462f9e62962cae328d8a6296900b6569';

var longitude;
var latitude;
var newDiv = document.createElement("div") //where is this being used? confirm and put it in its place

var existingEntries = JSON.parse(localStorage.getItem("allEntries")) || [];
var existingCity = []

function getApi(city) {

    // console.log(city);

    daily.innerHTML = "";
    fiveTitleHolder.innerHTML = "";
    fiveDay.innerHTML = "";

    // if (callmethod = 'search') {
    //     city = cityInput.value
    // } else {
    //     city = callmethod
    //     console.log("logging the city>>>" + city)
    // }

    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // TO DO MAKE THIS ONE FUNCTION THAT THIS CALLS THAT GIVES YOU THE TEXT BOX
        // console.log(data.weather['0'].icon)
        var newh2 = document.createElement("span");
        var newh3 = document.createElement("h3")
        newh3.innerHTML = city
        newh3.innerHTML += " (" + moment().format("l") + ")"
        daily.appendChild(newh3)
        daily.appendChild(newh2)

        const weatherImg = document.createElement("img");
        weatherImg.setAttribute('class', 'weather-image')
        // imgUrl = 
        weatherImg.src = "https://openweathermap.org/img/wn/" + data.weather["0"].icon + "@2x.png";
        daily.appendChild(weatherImg);

        newDiv.innerHTML = "<p>Temp: " + Math.round(data.main.temp - 273.15) + " *C</p>"
        newDiv.innerHTML += "<p>Wind: " + data.wind.speed + " MPH</p>"
        newDiv.innerHTML += "<p>Humidity: " + data.main.humidity + " %</p>"

        latitude = data.coord.lat
        longitude = data.coord.lon
        getUVIndex(latitude, longitude, city)
        
    })
}

function getUVIndex(latitude, longitude, city) {

    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly,minutely,alerts&appid=' + apiKey
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
      console.log(data)
      uvIndex = data.current.uvi

      newDiv.innerHTML += "UV Index: "

      let uvBtn = document.createElement("button");
      uvBtn.innerHTML = uvIndex;
      newDiv.appendChild(uvBtn);

      if (uvIndex <=2) { 
        // uvBtn.setAttribute('type', 'button')
        uvBtn.setAttribute('class', 'btn btn-success btn-sm')
        
      } else if (uvIndex >=3 && uvIndex <=5) { //yellow
        uvBtn.setAttribute('class', 'btn btn-warning btn-sm')
      } else if (uvIndex >= 6 && uvIndex <=7) { //orange
      } else if (uvIndex >= 8) { //red
        uvBtn.setAttribute('class', 'btn btn-danger btn-sm')
      }

      daily.appendChild(newDiv)


      //make this into a new function
      var fiveTitle = document.createElement("h3")

      fiveTitle.innerHTML = "5-Day Forecast"
      fiveTitleHolder.appendChild(fiveTitle)

      var cardDiv = {}

      for (var i = 0; i < 5; i++) {
          cardDiv[i] = document.createElement("div")

          cardDiv[i].setAttribute('class', 'bg-primary col-2')

          // cardDiv[i].setAttribute("class", "col-2");
  
          cardDiv[i].innerHTML = moment().add(i,'days').format("l")


          // const weatherImg = document.createElement("img");
          // weatherImg.setAttribute('class', 'weather-image')
          // // imgUrl = 
          // weatherImg.src = "https://openweathermap.org/img/wn/" + data.weather["0"].icon + "@2x.png";
          // fiveDay.appendChild(weatherImg);

          // cardDiv.innerHTML += "<i class=&quot;fa fa-trash-o&quot; aria-hidden=&quot;true&quot;></i>"
          cardDiv[i].innerHTML += "<p>Temp: " + Math.round(data.daily[i].temp.day - 273.15) + " *C</p>"
  
          cardDiv[i].innerHTML += "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>"
  
          cardDiv[i].innerHTML += "<p>Humidity: " + data.daily[i].humidity + " %</p>"
          fiveDay.appendChild(cardDiv[i])

      }
      saveCity(city)
    })
}

for (i = 0; i < existingEntries.length; i++) {
    existingCity[i] = document.createElement("button")
    existingCity[i].innerHTML = existingEntries[i]
    // existingCity[i].setAttribute('margin', '2px')
    existingCity[i].setAttribute('class', 'city-button btn btn-secondary btn-block')
    // existingCity[i].setAttribute('box-sizing', 'border-box')
    existingCity[i].setAttribute('data-searchterm', existingEntries[i])
    cityButtons.appendChild(existingCity[i])
}

// document.querySelectorAll('.city-button').forEach(function(el) {
//     el.addEventListener('click', function(event){
//         cityselection = el.textContent
//         getApi(cityselection)
//         console.log("clicked button on page>>>" + el.textContent)
//     })
// })

function saveCity(city) {
  // existingEntries.push(city)
  
    if (!existingEntries.includes(city)) { 
      // console.log("SAVE CITY INPUT VALUE >>>", city)
        existingEntries.push(city)
        localStorage.setItem("allEntries", JSON.stringify(existingEntries));
        var newCityButton = document.createElement("button")
        newCityButton.setAttribute('class','city-button btn btn-secondary btn-block')
        newCityButton.innerHTML = city
        cityButtons.appendChild(newCityButton)
    }
}

function handleSearchFormSubmit(event) {
  if(!cityInput.value) {
    return;
  }

  event.preventDefault();
  var searchTerm = cityInput.value.trim();
  getApi(searchTerm);
  cityInput.value = '';
}

function handleSearchHistoryClick(event) {
  if (event.target.matches('.city-button')) {
    var button = event.target;
    var searchTerm = button.getAttribute('data-searchterm');
    getApi(searchTerm);
  }
}

// searchButton.addEventListener('click', getApi("search"));
searchButton.addEventListener('click', handleSearchFormSubmit);
cityButtons.addEventListener('click', handleSearchHistoryClick);


  //TODO: get the weather icon on the same line
  //TODO: get spacing in between the icons 
  //todo: get all the icons in different parts of the script working???
  //q: is data[0] the current day, and then data[1] moving forward? 
  //q: make sure the weather #s are the correct ones 