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

//use clear button to clear all local storage and all text areas 
var clearBtn = document.getElementById('clear-button')
clearBtn.addEventListener('click', function(event) {
    localStorage.clear()
    cityButtons.innerHTML = ""
//     for (var i = 0; i < cityButtons.length; i++) {
//         $(textAreas[i]).val("")
//     }
})

// convert the user's input into a capitalized string of letters 
function getFinalCity(city) {

  const rawCity = city;
  console.log("HERE'S THE RAW CITy>>" + rawCity)
  const finalCity = rawCity.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  return finalCity
}

//get city info 
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
      if (response.status === 404) {
        window.alert('please enter a valid city')
      }
        return response.json();
    })
    .then(function (data) {
        // TO DO MAKE THIS ONE FUNCTION THAT THIS CALLS THAT GIVES YOU THE TEXT BOX
        // console.log(data.weather['0'].icon)
        var newh2 = document.createElement("span");
        var newh3 = document.createElement("h3")

        // const rawCity = city;
        // const finalCity = rawCity.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

        newh3.innerHTML = getFinalCity(city)
        newh3.innerHTML += " (" + moment().format("l") + ")"
        newh3.setAttribute('class', 'inline')
        daily.appendChild(newh3)
        daily.appendChild(newh2)

        const weatherImg = document.createElement("img");
        weatherImg.setAttribute('class', 'weather-image')
        // imgUrl = 
        weatherImg.src = "https://openweathermap.org/img/wn/" + data.weather["0"].icon + "@2x.png";
        daily.appendChild(weatherImg);

        newDiv.innerHTML = "<p>Temp: " + Math.round((data.main.temp - 273.15) * (9/5) + 32) + " \xB0F</p>"
        newDiv.innerHTML += "<p>Wind: " + data.wind.speed + " MPH</p>"
        newDiv.innerHTML += "<p>Humidity: " + data.main.humidity + " %</p>"

        latitude = data.coord.lat
        longitude = data.coord.lon
        getUVIndex(latitude, longitude, city)
        
    })
}

//grab uv index and the rest of the five day forecast
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
      uvBtn.disabled = true;
      // uvBtn.setAttribute('disabled')
      newDiv.appendChild(uvBtn);

      if (uvIndex <3) { 
        // uvBtn.setAttribute('type', 'button')
        uvBtn.setAttribute('class', 'btn btn-success btn-sm')
        
      } else if (uvIndex >=3 && uvIndex <6) { //yellow
        uvBtn.setAttribute('class', 'btn btn-warning btn-sm')
      } else if (uvIndex >= 6 && uvIndex <8) { //orange
        uvBtn.setAttribute('class', 'btn btn-warning btn-sm')
      } else if (uvIndex >= 8) { //red
        uvBtn.setAttribute('class', 'btn btn-danger btn-sm')
      }
      daily.setAttribute('class', 'daily-box')
      daily.appendChild(newDiv)


      //make this into a new function
      var fiveTitle = document.createElement("h3")

      fiveTitle.innerHTML = "5-Day Forecast"
      fiveTitleHolder.appendChild(fiveTitle)

      var cardDiv = {}
      var cardDate = {}

      for (var i = 0; i < 5; i++) {
          cardDiv[i] = document.createElement("div")

          cardDiv[i].setAttribute('class', 'bg-primary col-2 ml-3')

          cardDate[i] = document.createElement("h5")
          cardDate[i].innerHTML = moment().add(i,'days').format("l")
          cardDiv[i].appendChild(cardDate[i])
  
          const weatherImg = document.createElement("img"); //add back
          weatherImg.setAttribute('class', 'weather-image')

          weatherImg.src = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
          cardDiv[i].appendChild(weatherImg); //add back

          cardDiv[i].innerHTML += "<p>Temp: " + Math.round((data.daily[i].temp.day - 273.15) * (9/5) + 32) + " \xB0F</p>" //ADD BACK
  
          cardDiv[i].innerHTML += "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>" // ADD BACK
  
          cardDiv[i].innerHTML += "<p>Humidity: " + data.daily[i].humidity + " %</p>" //ADD BACK
          fiveDay.appendChild(cardDiv[i])

      }
      saveCity(getFinalCity(city))
    })
}

//populate the citybuttons list with all city buttons 
for (i = 0; i < existingEntries.length; i++) {
    existingCity[i] = document.createElement("button")
    existingCity[i].innerHTML = existingEntries[i]
    existingCity[i].setAttribute('class', 'city-button btn btn-secondary btn-block')
    existingCity[i].setAttribute('data-searchterm', existingEntries[i])
    cityButtons.appendChild(existingCity[i])
}

//save the citybutton to the citybuttons list 
function saveCity(city) {
  city = getFinalCity(city)
    if (!existingEntries.includes(city)) { 
      // console.log("SAVE CITY INPUT VALUE >>>", city)
        existingEntries.push(city)
        localStorage.setItem("allEntries", JSON.stringify(existingEntries));
        var newCityButton = document.createElement("button")
        newCityButton.setAttribute('class','city-button btn btn-secondary btn-block')
        newCityButton.setAttribute('data-searchterm', city)
        newCityButton.innerHTML = city
        cityButtons.appendChild(newCityButton)
    }
}

//transforms user input into a value that can be passed to getapi function
function handleSearchFormSubmit(event) {
  if(!cityInput.value) {
    return;
  }

  event.preventDefault();
  var searchTerm = cityInput.value.trim();
  getApi(searchTerm);
  cityInput.value = '';
}

//transforms user's click on the city buttons into a value that can be passed to getapi function
function handleSearchHistoryClick(event) {
  if (event.target.matches('.city-button')) {
    var button = event.target;
    var searchTerm = button.getAttribute('data-searchterm');
    console.log(searchTerm)
    getApi(searchTerm);
  }
}

//add event listeners for the respective buttons 
searchButton.addEventListener('click', handleSearchFormSubmit);
searchButton.addEventListener('keyup', function(e) {
  if(e.key === "Enter") {
    e.preventDefault()
    handleSearchFormSubmit()
  }
})
cityButtons.addEventListener('click', handleSearchHistoryClick);




  //to do: press enter and have the form submit 
  //q: is data[0] the current day, and then data[1] moving forward? 
  //q: make sure the weather #s are the correct ones 
  // dashboard does not populate when it is on github, but works fine on live server
// make layout responsive (flexbox) for mobile applications 
//make it look more like the mockup