// Uses the free Open-Meteo API (no API key needed)
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const message = document.getElementById('message');
const result = document.getElementById('result');

const codes = {0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',
  51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',
  71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Rain showers',82:'Violent showers',
  95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with hail'};

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) { message.textContent = 'Please enter a city name.'; return; }
  message.textContent = 'Loading...';
  result.classList.add('hidden');

  try {
    // 1) Geocoding: city name -> latitude/longitude
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geo = await geoRes.json();
    if (!geo.results) throw new Error('City not found');
    const { latitude, longitude, name, country } = geo.results[0];

    // 2) Current weather
    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
    if (!wRes.ok) throw new Error('Weather service error');
    const w = (await wRes.json()).current;

    document.getElementById('cityName').textContent = `${name}, ${country}`;
    document.getElementById('temp').textContent = `${w.temperature_2m}°C`;
    document.getElementById('condition').textContent = codes[w.weather_code] || 'Unknown';
    document.getElementById('humidity').textContent = `Humidity: ${w.relative_humidity_2m}%`;
    document.getElementById('wind').textContent = `Wind: ${w.wind_speed_10m} km/h`;
    message.textContent = '';
    result.classList.remove('hidden');
  } catch (err) {
    message.textContent = err.message;
  }
}

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', e => { if (e.key === 'Enter') getWeather(); });
