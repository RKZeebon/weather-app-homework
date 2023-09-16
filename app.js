const apiKey = "16f00dd6edca31d9934c7fd9cdfba77c";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";

const form = document.querySelector(".inputForm");
const inputField = document.querySelector(".inputCity")

form.addEventListener("submit", handleSubmit);

const select = document.querySelector(".cities");

select.addEventListener("click", (e) => {
  e.preventDefault();
  // I changed here
  const newInput = e.target.innerText
  document.querySelector(".inputCity").value = newInput;
  select.style.display = "none"
  fetchWeatherData(newInput);
});

function suggestTyping() {
  getAllCities().then((cities) =>
    document
      .querySelector(".inputCity")
      .addEventListener("keyup", (event) => handleTyping(event, cities))
  );
}

function handleTyping(e, cities) {
  e.preventDefault();
  const cityPrefix = document.querySelector(".inputCity").value;
  const selectedCities = cities
    .filter((city) => city.toLowerCase().startsWith(cityPrefix.toLowerCase()))
    .slice(0, 5);
  let selector = document.querySelector(".cities");
  selector.innerText = '';

  if (cityPrefix && e.key === "Enter") {
    selector.style.display = "none"
  }

  else if (cityPrefix) {
    selectedCities.forEach((city) => {
      // I changed here
      selector.style.display = "block"
      const option = document.createElement("li");
      option.innerText = city;
      selector.appendChild(option);
    });
  }


}

function handleSubmit(e) {
  e.preventDefault();
  const city = document.querySelector(".inputCity").value;
  fetchWeatherData(city);


}

async function fetchWeatherData(city) {
  const apiResponse = await fetch(
    `${baseUrl}q=${city}&units=metric&APPID=${apiKey}`
  );
  const weatherData = apiResponse.json();
  weatherData.then((data) => {

    if (data.message == "city not found") {
      alert("Enter a Correct City Name");
    }
    else {
      document.querySelector(".city").textContent = data.name;
      document.querySelector(".country").textContent = `, ${data.sys.country}`;
      document.querySelector(".temprature").textContent = `${Math.round(data.main.temp)}°C`;
      document.querySelector(".sky").textContent = data.weather[0].main;
      document.querySelector(".min-max").textContent = `${Math.round(data.main.temp_min)}°C / ${Math.round(data.main.temp_max)}°C`;
      // I changed here
      inputField.value = ''
    }

  });

}


function getAllCities() {
  return fetch("https://countriesnow.space/api/v0.1/countries")
    .then((res) => res.json())
    .then((res) => res.data)
    .then((data) =>
      data
        .map((obj) => obj.cities)
        .reduce((cities, array) => cities.concat(array), [])
    );
}



document.addEventListener("DOMContentLoaded", function () {
  fetchWeatherData("Dhaka");
  suggestTyping();
});