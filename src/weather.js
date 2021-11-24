import PubSub from 'pubsub-js';
import EVENT_TYPES from './eventTypes';

const weather = (() => {
  const apiKey = '9e9bcaab9af0d61546c01e9bc023065f';
  const openWeatherURLs = {
    geocode: 'http://api.openweathermap.org/geo/1.0/direct?',
    oneCall: 'https://api.openweathermap.org/data/2.5/onecall?',
  };

  const fetchJSON = async (requestURL) => {
    const response = await fetch(requestURL, { mode: 'cors' });
    return response.json();
  };

  const createLocationRequestURL = (cityName, country) => {
    const options = `q=${cityName},${country}&appid=${apiKey}`;
    const requestURL = openWeatherURLs.geocode + options;
    return requestURL;
  };

  const getCityPosition = async (cityName, country) => {
    const requestURL = createLocationRequestURL(cityName, country);
    const data = await fetchJSON(requestURL);
    const { lat, lon } = data[0];
    return { lat, lon };
  };

  const createWeatherRequestURL = ({ lat, lon }) => {
    const options = `lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
    const requestURL = openWeatherURLs.oneCall + options;
    return requestURL;
  };

  const getDailyData = (dayData) => ({
    date: new Date(dayData.dt * 1000),
    min_temp: dayData.temp.min,
    max_temp: dayData.temp.max,
    weather: dayData.weather[0].main,
  });

  const getDailyForecast = (daily) => {
    const dailyData = daily.slice(1).map(getDailyData);
    return dailyData;
  };

  const getTodayData = (todayData, cityName) => ({
    temp: todayData.temp,
    visibility: todayData.visibility,
    humidity: todayData.humidity,
    pressure: todayData.pressure,
    windDeg: todayData.wind_deg,
    windSpeed: todayData.wind_speed,
    weather: todayData.weather[0].main,
    date: new Date(todayData.dt * 1000),
    location: cityName,
  });

  const processWeather = ({ current, daily }, cityName) => ({
    today: getTodayData(current, cityName),
    daily: getDailyForecast(daily),
  });

  const getWeatherInfo = async (cityLocation, cityName) => {
    const requestURL = createWeatherRequestURL(cityLocation);
    let weatherInfo = await fetchJSON(requestURL);
    weatherInfo = processWeather(weatherInfo, cityName);
    return weatherInfo;
  };

  const getWeather = async (_, data) => {
    const cityLocation = await getCityPosition(data);
    const weatherInfo = await getWeatherInfo(cityLocation, cityName);
    PubSub.publish(EVENT_TYPES.weather_info, weatherInfo);
  };

  PubSub.subscribe(EVENT_TYPES.get_weather, getWeather);
})();

export default weather;
