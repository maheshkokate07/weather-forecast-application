console.log("hello world!")

const apiKey = "c2f0170a3f0b170472f864d83a2b94a6";

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        const data = await response.json();

        if (response.status === 200) {
            displayCurrentWeather(data);
            displayForecast(data);
        } else {
            showErrorMessage(data.message);
        }
    } catch (err) {
        showErrorMessage("Some Error occured, please try again!");
    }
}

function displayCurrentWeather(data) {
    const cityName = data.city.name;
    const temp = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;
    const iconCode = data.list[0].weather[0].icon;

    document.getElementById('cityName').innerText = cityName;
    document.getElementById('temperature').innerText = temp;
    document.getElementById('humidity').innerText = humidity;
    document.getElementById('windSpeed').innerText = windSpeed;

    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById('errorMessage').classList.add('hidden');
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('extendedForecast');
    forecastContainer.innerHTML = '';

    // Extract data for every 8th entry (approximately every 24 hours)
    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const temp = forecast.main.temp;
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;
        const iconCode = forecast.weather[0].icon;

        // Create forecast card
        const forecastCard = `
        <div class="p-4 bg-white rounded-lg shadow-md text-center">
          <p class="font-semibold">${date}</p>
          <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon" class="w-12 h-12 mx-auto">
          <p>Temp: ${temp} °C</p>
          <p>Wind: ${windSpeed} km/h</p>
          <p>Humidity: ${humidity} %</p>
        </div>
      `;

        // Append the forecast card to the container
        forecastContainer.innerHTML += forecastCard;
    }
}

function showErrorMessage(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.innerText = message;
    errorMessageElement.classList.remove('hidden');
}

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeather(city);
    } else {
        showErrorMessage('Please enter a valid city name.');
    }
});