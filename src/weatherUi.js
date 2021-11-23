import PubSub from 'pubsub-js';
import EVENT_TYPES from './eventTypes';
import { convertDateToString } from './helperFuncs';

const weatherUi = (() => {
  const getForecastCards = () => {
    const forecastCards = [...document.querySelectorAll('.forecast__card')];
    return forecastCards.map((forecastCard) => ({
      date: forecastCard.querySelector('.forecast__card__title'),
      img: forecastCard.querySelector('.weather-img'),
      temp_high: forecastCard.querySelector('.forecast__card__high'),
      temp_low: forecastCard.querySelector('.forecast__card__low'),
    }));
  };

  const getHighlights = () => {
    const humidityHighlight = document.getElementById('weather-humidity');
    const visibilityHighlight = document.getElementById('weather-visibility');
    const pressureHighlight = document.getElementById('weather-pressure');
    const windStatusHighlight = document.getElementById('weather-wind-status');

    return {
      humidity: {
        value: humidityHighlight.querySelector('.highlights__card__value'),
        progressBar: humidityHighlight.querySelector('.progress-bar'),
      },
      windStatus: {
        value: windStatusHighlight.querySelector('.highlights__card__value'),
      },
      visibility: {
        value: visibilityHighlight.querySelector('.highlights__card__value'),
      },
      pressure: {
        value: pressureHighlight.querySelector('.highlights__card__value'),
      },
    };
  };

  const getDomInTodaySection = () => ({
    weatherImg: document.getElementById('today-weather-img'),
    tempValue: document.getElementById('today-temp-value'),
    tempUnit: document.getElementById('today-temp-unit'),
    description: document.getElementById('today-description'),
    date: document.getElementById('today-date'),
    location: document.getElementById('today-location'),
  });

  const dom = {
    today: getDomInTodaySection(),
    forecastCards: getForecastCards(),
    highlights: getHighlights(),
    getLocationBtn: document.getElementById('location-btn'),
  };

  const weatherToClassName = {
    Rain: 'weather-img--heavy-rain',
    Clouds: 'weather-img--light-cloud',
    Drizzle: 'weather-img--shower',
    Thunderstorm: 'weather-img--thunderstorm',
    Snow: 'weather-img--snow',
    Clear: 'weather-img--clear',
  };

  const updateMainInfo = ({ weather, temp, date, location }) => {
    const weatherClassName = weatherToClassName[weather];
    dom.today.weatherImg.className = `weather-img weather-img--large ${weatherClassName}`;
    dom.today.tempValue.textContent = Math.round(temp, 1);
    dom.today.description = weather;
    //dom.today.date = convertDateToString(date);
    dom.today.location = location;
  };

  const updateHighlights = (todayWeather) => {
    const { humidity, visibility, windStatus, pressure } = dom.highlights;
    humidity.value.textContent = todayWeather.humidity;
    humidity.progressBar.style.setProperty(
      '--value',
      `${todayWeather.humidity}%`,
    );

    visibility.value.textContent = (todayWeather.visibility / 1000)
      .toFixed(1);
    windStatus.value.textContent = todayWeather.windDeg;
    pressure.value.textContent = todayWeather.pressure;
  };

  const updateTodayInfo = (todayWeather) => {
    updateMainInfo(todayWeather);
    updateHighlights(todayWeather);
  };

  const updateDailyInfo = (dailyForecast) => {
    dom.forecastCards.forEach((card, i) => {
      const dayInfo = dailyForecast[i];
      const weatherClassName = weatherToClassName[dayInfo.weather];
      //card.date.textContent = convertDateToString(dayInfo.date);
      card.img.className = `weather-img, ${weatherClassName}`;
      card.temp_high.textContent = Math.round(dayInfo.max_temp);
      card.temp_low.textContent = Math.round(dayInfo.min_temp);
    });
  };

  const updateWeatherInfo = (_, { today, daily }) => {
    updateTodayInfo(today);
    updateDailyInfo(daily);
  };

  const getWeatherForUserLocation = () => {};

  const addEventListeners = () => {
    dom.getLocationBtn.addEventListener('click', getWeatherForUserLocation);
  };

  addEventListeners();
  PubSub.subscribe(EVENT_TYPES.weather_info, updateWeatherInfo);
})();

export default weatherUi;
