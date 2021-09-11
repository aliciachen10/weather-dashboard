var searchButton = document.getElementById('search-button');
var cityInput = document.getElementById('city-input');
var daily = document.getElementById('daily')
var apiKey = '462f9e62962cae328d8a6296900b6569';
// fetch request gets a list of all the repos for the node.js organization
var longitude;
var latitude;
function getApi() {

    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput.value + '&appid=' + apiKey
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        //Loop over the data to generate a table, each table row will have a link to the repo url
        // for (var i = 0; i < data.length; i++) {
        //   // Creating elements, tablerow, tabledata, and anchor
        //   var createTableRow = document.createElement('tr');
        //   var tableData = document.createElement('td');
        //   var link = document.createElement('a');

        //   // Setting the text of link and the href of the link
        //   link.textContent = data[i].html_url;
        //   link.href = data[i].html_url;

        //   // Appending the link to the tabledata and then appending the tabledata to the tablerow
        //   // The tablerow then gets appended to the tablebody
        //   tableData.appendChild(link);
        //   createTableRow.appendChild(tableData);
        //   tableBody.appendChild(createTableRow);
        // }

        var newh2 = document.createElement("h2");

        newh2.innerHTML = cityInput.value
        newh2.innerHTML += " (" + moment().format("l") + ")"

        // newh2.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>'

        daily.appendChild(newh2)

        var newDiv = document.createElement("div")

        newDiv.innerHTML = "<p>Temp " + Math.round(data.main.temp - 273.15) + " *C</p>"

        newDiv.innerHTML += "<p>Wind " + data.wind.speed + " MPH</p>"

        newDiv.innerHTML += "<p>Humidity " + data.main.humidity + " %</p>"

        newDiv.innerHTML += "<p>UV Index</p>"

        daily.appendChild(newDiv)

        latitude = data.coord.lat
        longitude = data.coord.lon
        
    });

    console.log("latitude>>" + latitude) // how do i get this to log? 
    console.log("longitude>>" + longitude) // how do i get this to log? 

}

  searchButton.addEventListener('click', getApi);

  //TODO: get the weather icon to the side working