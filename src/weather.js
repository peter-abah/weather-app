import PubSub from 'pubsub-js';
import EVENT_TYPES from './eventTypes';

const weather = (() => {
  const apiKey = '9e9bcaab9af0d61546c01e9bc023065f';
  const openWeatherURLs = {
    geocode: 'http://api.openweathermap.org/geo/1.0/direct?',
    oneCall: 'https://api.openweathermap.org/data/2.5/onecall?',
    geocodeReverse: 'http://api.openweathermap.org/geo/1.0/reverse?', 
  };

  const fetchJSON = async (requestURL) => {
    const response = await fetch(requestURL, { mode: 'cors' });
    return response.json();
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

  const createCityNameRequestURL = ({ lat, lon }) => {
    const options = `lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const requestURL = openWeatherURLs.geocodeReverse + options;
    return requestURL;
  };

  const getCityName = async (cityLocation) => {
    const requestURL = createCityNameRequestURL(cityLocation);
    const data = await fetchJSON(requestURL);
    const { name } = data[0];
    return name;
  };

  const getCityInfo = async (data) => {
    let cityLocation;
    let cityName;

    if (data.lat) {
      cityLocation = { lat: data.lat, lon: data.lon };
      cityName = await getCityName(cityLocation);
    } else {
      cityName = data.cityName;
      cityLocation = await getCityPosition(cityName, data.country);
    }

    return { cityLocation, cityName };
  };

  const getWeather = async (_, data) => {
    try {
      const { cityLocation, cityName } = await getCityInfo(data);
      const weatherInfo = await getWeatherInfo(cityLocation, cityName);
      PubSub.publish(EVENT_TYPES.weather_info, weatherInfo);
    } catch (e) {
      const error = { message: 'Could not get weather. Please try again', error: e };
      PubSub.publish(EVENT_TYPES.weather_info, { error });
    }
  };

  PubSub.subscribe(EVENT_TYPES.get_weather, getWeather);
})();

export default weather;
