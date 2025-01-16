let apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=59.3293&longitude=18.0686&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin"
const cityElement = document.getElementById('city');
const currentTempElement = document.getElementById('current-temp');
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            console.log(`Lat: ${lat}, Long: ${long}`);

            apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe%2FBerlin`;
            
            getWeather();
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

function getWeather() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            try {
                //temp, date and time    
                const currentTemp = data.current_weather.temperature;
                const currentTime = new Date();

                const date = currentTime.toLocaleDateString();
                const time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const minTemp = data.daily.temperature_2m_min;
                const maxTemp = data.daily.temperature_2m_max;
                const dailyDates = data.daily.time;

                if (currentTempElement && currentDateElement && currentTimeElement) {
                    currentTempElement.textContent = `${currentTemp}°C`;
                    currentDateElement.textContent = date;
                    currentTimeElement.textContent = time;
                }
            if (document.getElementById("day1-date")){

                for ( let i = 0; i < 5; i++) {
                    const dayDate = new Date(dailyDates[i]);
                    const dayName = dayDate.toLocaleDateString('en-GB', {weekday: 'long'});
                    const fullDate = dayDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'long'});
                    
                    document.getElementById("day" + (i + 1) + "-date").innerHTML = `${dayName}, ${fullDate}`;
                    document.getElementById("day" + (i + 1) + "-min").innerHTML = ` ${minTemp[i].toFixed(1)} °C`;
                    document.getElementById("day" + (i + 1) + "-max").innerHTML = ` ${maxTemp[i].toFixed(1)} °C`;
                }
            }
        }
            catch (error) {
                console.error('Error processing weather data:', error);
                alert('Error processing weather data. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
}

window.onload = getLocation;
