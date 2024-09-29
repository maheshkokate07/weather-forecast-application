const apiKey = "c2f0170a3f0b170472f864d83a2b94a6";

async function fetchWeatherByCity(city) {
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
        showErrorMessage("Error fetching weather data. Please try again!");
    }
}

// Function to fetch weather by geographic coordinates
async function fetchWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (response.status === 200) {
            displayCurrentWeather(data);
            displayForecast(data);
        } else {
            showErrorMessage(data.message);
        }
    } catch (error) {
        showErrorMessage("Error fetching weather data. Please try again!");
    }
}

function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoordinates(lat, lon);
        }, (error) => {
            showErrorMessage("Unable to fetch your location!");
        })
    } else {
        showErrorMessage("Unable to fetch your location!")
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
    errorMessageElement.innerText = "Error: " + message;
    errorMessageElement.classList.remove('hidden');
    errorMessageElement.style.display = 'block';
    setTimeout(() => {
        errorMessageElement.classList.add('hidden');
        errorMessageElement.style.display = 'none';
    }, 3000)
}

// Function for storing recently searched cities in localStorage
function storeRecentCity(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

    // Add recent city if it doesn't exist in the list
    if (!recentCities.includes(city)) {
        recentCities.push(city);

        // Keep onlu last 5 cities
        if (recentCities.length > 5) {
            recentCities.shift();
        }

        localStorage.setItem('recentCities', JSON.stringify(recentCities));
        updateDropdown();
    }
}

// Function for updating the dropdown 
function updateDropdown() {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    const dropdownContainer = document.getElementById('recentCitiesContainer');
    const dropdown = document.getElementById('recentCitiesDropdown');

    // Show dropdown only if there are cities in list
    if (recentCities.length > 0) {
        dropdownContainer.classList.remove('hidden');
        dropdownContainer.style.display = 'block';
        dropdown.innerHTML = '';

        recentCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.text = city;
            dropdown.appendChild(option);
        });
    } else {
        dropdownContainer.classList.add('hidden');
        dropdownContainer.style.display = 'none';
    }
}

// Function to handle city selection from the dropdown
document.getElementById('recentCitiesDropdown').addEventListener('change', (event) => {
    const selectedCity = event.target.value;
    document.getElementById('cityInput').value = selectedCity;
    fetchWeatherByCity(selectedCity);
});

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeatherByCity(city);
        storeRecentCity(city);
    } else {
        showErrorMessage('Please enter a valid city name!');
    }
});

// Add event listener to the current location button
document.getElementById('locationButton').addEventListener('click', () => {
    useCurrentLocation();
});

// Call this function on page load to populate the dropdown with stored cities
document.addEventListener('DOMContentLoaded', () => {
    updateDropdown(); // Update dropdown when page loads
});